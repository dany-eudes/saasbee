<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TenantOwnerWelcome extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        public string $domain
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to Your New Application - Access Details Inside',
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'emails.tenant-owner-welcome',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
