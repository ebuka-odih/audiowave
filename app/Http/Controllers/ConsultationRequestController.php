<?php

namespace App\Http\Controllers;

use App\Mail\InquiryConfirmationMail;
use App\Mail\InquiryReceivedMail;
use App\Models\ConsultationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Throwable;

class ConsultationRequestController extends Controller
{
    private const PLACEHOLDER_MAIL_VALUES = [
        'your-mailtrap-smtp-password-or-token',
        'your-smtp-password',
        'your-smtp-user',
        'smtp.your-provider.com',
        'hello@example.com',
    ];

    public function index(): JsonResponse
    {
        return response()->json([
            'requests' => ConsultationRequest::query()
                ->orderByDesc('created_at')
                ->get(['id', 'name', 'email', 'interest', 'message', 'created_at'])
                ->map(function (ConsultationRequest $request): array {
                    return [
                        'id' => $request->id,
                        'name' => $request->name,
                        'email' => $request->email,
                        'interest' => $request->interest,
                        'message' => $request->message,
                        'createdAt' => optional($request->created_at)->toISOString(),
                    ];
                }),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $name = trim((string) $request->input('name', ''));
        $email = trim((string) $request->input('email', ''));
        $interest = trim((string) $request->input('interest', ''));
        $message = trim((string) $request->input('message', ''));

        if ($name === '' || $email === '' || $interest === '' || $message === '') {
            return response()->json(['error' => 'name, email, interest, and message are required.'], 400);
        }

        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return response()->json(['error' => 'email must be a valid email address.'], 400);
        }

        $consultationRequest = ConsultationRequest::create([
            'id' => (string) Str::uuid(),
            'name' => $name,
            'email' => $email,
            'interest' => $interest,
            'message' => $message,
        ]);

        $mailPayload = $consultationRequest->only(['name', 'email', 'interest', 'message']) + [
            'createdAt' => optional($consultationRequest->created_at)->toISOString() ?? now()->toISOString(),
        ];

        $adminEmail = $this->resolveAdminEmail();

        if ($adminEmail === null) {
            Log::error('Admin inquiry email is not configured correctly.');

            return response()->json([
                'error' => 'Admin inquiry email is not configured.',
            ], 500);
        }

        $mailConfigurationError = $this->resolveMailConfigurationError();

        if ($mailConfigurationError !== null) {
            Log::error('Mail delivery is not configured correctly.', [
                'reason' => $mailConfigurationError,
            ]);

            return response()->json([
                'error' => 'Email delivery is not configured. Update the mail settings and try again.',
            ], 500);
        }

        try {
            Mail::to($adminEmail)->send(new InquiryReceivedMail($mailPayload));
        } catch (Throwable $exception) {
            Log::error('Failed to send admin inquiry email', [
                'exception' => $exception,
            ]);

            return response()->json([
                'error' => 'We could not deliver your request to the admin inbox. Please try again once email delivery is available.',
            ], 502);
        }

        try {
            Mail::to($consultationRequest->email)->send(new InquiryConfirmationMail($mailPayload));
        } catch (Throwable $exception) {
            Log::error('Failed to send requester inquiry email', [
                'exception' => $exception,
            ]);
        }

        return response()->json([
            'request' => [
                'id' => $consultationRequest->id,
                'name' => $consultationRequest->name,
                'email' => $consultationRequest->email,
                'interest' => $consultationRequest->interest,
                'message' => $consultationRequest->message,
                'createdAt' => optional($consultationRequest->created_at)->toISOString(),
            ],
        ], 201);
    }

    public function update(Request $request): JsonResponse
    {
        $id = trim((string) ($request->query('id') ?? $request->input('id', '')));

        if ($id === '') {
            return response()->json(['error' => 'id is required.'], 400);
        }

        $name = trim((string) $request->input('name', ''));
        $email = trim((string) $request->input('email', ''));
        $interest = trim((string) $request->input('interest', ''));
        $message = trim((string) $request->input('message', ''));

        if ($name === '' || $email === '' || $interest === '' || $message === '') {
            return response()->json(['error' => 'name, email, interest, and message are required.'], 400);
        }

        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return response()->json(['error' => 'email must be a valid email address.'], 400);
        }

        $consultationRequest = ConsultationRequest::query()->find($id);

        if ($consultationRequest === null) {
            return response()->json(['error' => 'Request not found.'], 404);
        }

        $consultationRequest->update([
            'name' => $name,
            'email' => $email,
            'interest' => $interest,
            'message' => $message,
        ]);

        return response()->json([
            'request' => [
                'id' => $consultationRequest->id,
                'name' => $consultationRequest->name,
                'email' => $consultationRequest->email,
                'interest' => $consultationRequest->interest,
                'message' => $consultationRequest->message,
                'createdAt' => optional($consultationRequest->created_at)->toISOString(),
            ],
        ]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $id = trim((string) $request->query('id', ''));

        if ($id === '') {
            return response()->json(['error' => 'id is required.'], 400);
        }

        $consultationRequest = ConsultationRequest::query()->find($id);

        if ($consultationRequest === null) {
            return response()->json(['error' => 'Request not found.'], 404);
        }

        $consultationRequest->delete();

        return response()->json(['success' => true]);
    }

    private function resolveAdminEmail(): ?string
    {
        $adminEmail = trim((string) config('mail.admin_email', ''));

        if ($adminEmail === '' || ! filter_var($adminEmail, FILTER_VALIDATE_EMAIL)) {
            return null;
        }

        return $adminEmail;
    }

    private function resolveMailConfigurationError(): ?string
    {
        $defaultMailer = (string) config('mail.default', '');

        if ($defaultMailer === '' || in_array($defaultMailer, ['array', 'log'], true)) {
            return null;
        }

        if ($defaultMailer !== 'smtp') {
            return null;
        }

        $smtpConfig = config('mail.mailers.smtp', []);

        if (! is_array($smtpConfig)) {
            return 'SMTP mailer configuration is missing.';
        }

        foreach (['host', 'username', 'password'] as $key) {
            $value = trim((string) ($smtpConfig[$key] ?? ''));

            if ($value === '') {
                return sprintf('SMTP %s is missing.', $key);
            }

            if (in_array($value, self::PLACEHOLDER_MAIL_VALUES, true)) {
                return sprintf('SMTP %s is still using a placeholder value.', $key);
            }
        }

        return null;
    }
}
