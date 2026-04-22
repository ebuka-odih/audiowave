<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
    <h2 style="margin-bottom: 16px;">New AudioWerkhaus inquiry</h2>
    <p><strong>Name:</strong> {{ $payload['name'] }}</p>
    <p><strong>Email:</strong> {{ $payload['email'] }}</p>
    <p><strong>Interest:</strong> {{ $payload['interest'] }}</p>
    <p><strong>Submitted:</strong> {{ $payload['createdAt'] }}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space: pre-wrap;">{{ $payload['message'] }}</p>
</div>
