<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
    <h2 style="margin-bottom: 16px;">We received your inquiry</h2>
    <p>Hi {{ $payload['name'] }},</p>
    <p>We received your AudioWerkhaus inquiry and will follow up soon.</p>
    <p><strong>Interest:</strong> {{ $payload['interest'] }}</p>
    <p><strong>Submitted:</strong> {{ $payload['createdAt'] }}</p>
    <p><strong>Your message:</strong></p>
    <p style="white-space: pre-wrap;">{{ $payload['message'] }}</p>
    <p>If you need to add more details, reply to this email or contact us at info@audiowerkhaus.com.</p>
</div>
