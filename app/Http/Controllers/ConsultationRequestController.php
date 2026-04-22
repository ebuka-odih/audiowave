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

class ConsultationRequestController extends Controller
{
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

        try {
            if (filled(config('mail.admin_email'))) {
                Mail::to(config('mail.admin_email'))->send(new InquiryReceivedMail($mailPayload));
            }
        } catch (\Throwable $exception) {
            Log::error('Failed to send admin inquiry email', [
                'exception' => $exception,
            ]);
        }

        try {
            Mail::to($consultationRequest->email)->send(new InquiryConfirmationMail($mailPayload));
        } catch (\Throwable $exception) {
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
}
