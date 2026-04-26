<?php

namespace Tests\Feature;

use App\Mail\InquiryConfirmationMail;
use App\Mail\InquiryReceivedMail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ConsultationRequestControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_consultation_requests_send_admin_and_requester_emails(): void
    {
        Mail::fake();

        Config::set('mail.default', 'array');
        Config::set('mail.admin_email', 'admin@audiowerkhaus.com');

        $response = $this->postJson('/api/consultation-requests', [
            'name' => 'Ada Lovelace',
            'email' => 'ada@example.com',
            'interest' => 'The Monolith',
            'message' => 'Please share availability and listening room requirements.',
        ]);

        $response->assertCreated();

        Mail::assertSent(InquiryReceivedMail::class, function (InquiryReceivedMail $mail) {
            return $mail->hasTo('admin@audiowerkhaus.com')
                && $mail->hasReplyTo('ada@example.com', 'Ada Lovelace');
        });

        Mail::assertSent(InquiryConfirmationMail::class, function (InquiryConfirmationMail $mail) {
            return $mail->hasTo('ada@example.com');
        });
    }

    public function test_consultation_requests_fail_when_admin_email_is_invalid(): void
    {
        Mail::fake();

        Config::set('mail.default', 'array');
        Config::set('mail.admin_email', 'not-an-email');

        $response = $this->postJson('/api/consultation-requests', [
            'name' => 'Ada Lovelace',
            'email' => 'ada@example.com',
            'interest' => 'Custom Build',
            'message' => 'Need a quote.',
        ]);

        $response
            ->assertStatus(500)
            ->assertJson([
                'error' => 'Admin inquiry email is not configured.',
            ]);

        Mail::assertNothingSent();
    }

    public function test_consultation_requests_fail_when_smtp_uses_placeholder_credentials(): void
    {
        Mail::fake();

        Config::set('mail.default', 'smtp');
        Config::set('mail.admin_email', 'admin@audiowerkhaus.com');
        Config::set('mail.mailers.smtp.host', 'live.smtp.mailtrap.io');
        Config::set('mail.mailers.smtp.username', 'api');
        Config::set('mail.mailers.smtp.password', 'your-mailtrap-smtp-password-or-token');

        $response = $this->postJson('/api/consultation-requests', [
            'name' => 'Ada Lovelace',
            'email' => 'ada@example.com',
            'interest' => 'Heavy Collection',
            'message' => 'Need a demo.',
        ]);

        $response
            ->assertStatus(500)
            ->assertJson([
                'error' => 'Email delivery is not configured. Update the mail settings and try again.',
            ]);

        Mail::assertNothingSent();
    }
}
