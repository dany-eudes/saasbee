@php
    $appDomain = \App\Helpers\DomainHelper::getAppDomainWithoutProtocol();
@endphp

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Your New Application</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #f8fafc;
            color: #1f2937;
            line-height: 1.6;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
        }

        .logo {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .header-subtitle {
            color: #e5e7eb;
            font-size: 16px;
            margin: 0;
        }

        .content {
            padding: 40px 30px;
        }

        .welcome-title {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
        }

        .welcome-text {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 30px;
        }

        .credentials-card {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
        }

        .credentials-title {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }

        .credentials-title::before {
            content: "🔐";
            margin-right: 10px;
        }

        .credential-item {
            margin-bottom: 15px;
            display: flex;
            align-items: flex-start;
        }

        .credential-label {
            font-weight: 600;
            color: #374151;
            min-width: 80px;
            margin-right: 15px;
        }

        .credential-value {
            color: #1f2937;
            background-color: #ffffff;
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid #d1d5db;
            font-family: 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', Consolas, 'Courier New', monospace;
            font-size: 14px;
            flex: 1;
            word-break: break-all;
        }

        .login-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            transition: transform 0.2s;
        }

        .login-button:hover {
            transform: translateY(-1px);
        }

        .info-section {
            background-color: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 20px;
            margin: 30px 0;
            border-radius: 0 8px 8px 0;
        }

        .info-title {
            font-weight: 600;
            color: #1e40af;
            margin-bottom: 10px;
        }

        .info-text {
            color: #1e40af;
            font-size: 14px;
            margin: 0;
        }

        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }

        .footer-text {
            color: #6b7280;
            font-size: 14px;
            margin: 0;
        }

        .security-notice {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
        }

        .security-notice-title {
            font-weight: 600;
            color: #92400e;
            margin-bottom: 5px;
        }

        .security-notice-text {
            color: #92400e;
            font-size: 14px;
            margin: 0;
        }

        @media (max-width: 600px) {
            .container {
                margin: 0 10px;
            }

            .header,
            .content,
            .footer {
                padding: 20px;
            }

            .credential-item {
                flex-direction: column;
            }

            .credential-label {
                margin-bottom: 5px;
                min-width: auto;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <div class="logo">Welcome to SaasBee</div>
            <p class="header-subtitle">Your tenant management platform is ready</p>
        </div>

        <div class="content">
            <h1 class="welcome-title">Hello {{ $name }},</h1>

            <p class="welcome-text">
                Congratulations! Your tenant account has been successfully created. We're excited to have you on board.
                Your application is now ready and accessible at your dedicated domain.
            </p>

            <div class="credentials-card">
                <h2 class="credentials-title">Your Login Credentials</h2>

                <div class="credential-item">
                    <span class="credential-label">Domain:</span>
                    <span class="credential-value">{{ $domain }}.{{ $appDomain }}</span>
                </div>

                <div class="credential-item">
                    <span class="credential-label">Email:</span>
                    <span class="credential-value">{{ $email }}</span>
                </div>

                <div class="credential-item">
                    <span class="credential-label">Password:</span>
                    <span class="credential-value">{{ $password }}</span>
                </div>
            </div>

            <div class="security-notice">
                <div class="security-notice-title">🔒 Security Recommendation</div>
                <p class="security-notice-text">
                    For your security, please change your password after your first login. You can do this in your
                    account settings.
                </p>
            </div>

            <div style="text-align: center;">
                <a href="https://{{ $domain }}.{{ $appDomain }}" class="login-button">Access Your
                    Application</a>
            </div>

            <div class="info-section">
                <div class="info-title">Getting Started</div>
                <p class="info-text">
                    As a tenant owner, you have full administrative access to your application instance. You can manage
                    users,
                    configure settings, and customize your application to meet your specific needs. If you need any
                    assistance
                    or have questions, our support team is here to help.
                </p>
            </div>

            <div class="info-section">
                <div class="info-title">What's Next?</div>
                <p class="info-text">
                    • Log in to your application using the credentials above<br>
                    • Update your password and profile information<br>
                    • Explore the admin dashboard and available features<br>
                    • Invite additional users to your tenant if needed<br>
                    • Contact support if you have any questions
                </p>
            </div>
        </div>

        <div class="footer">
            <p class="footer-text">
                This email was sent to {{ $email }}. If you did not request this account, please contact our
                support team immediately.
            </p>
            <p class="footer-text" style="margin-top: 10px;">
                © {{ date('Y') }} SaasBee. All rights reserved.
            </p>
        </div>
    </div>
</body>

</html>
