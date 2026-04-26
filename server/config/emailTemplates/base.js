export const baseEmailTemplate = (title, content) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            box-sizing: border-box;
        }
        body {
            font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
            width: 100% !important;
            min-height: 100vh;
        }
        .wrapper {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            width: 100%;
        }
        .header {
            background-color: #2563eb;
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            letter-spacing: -0.025em;
            word-wrap: break-word;
        }
        .content {
            padding: 30px 20px;
            color: #374151;
            line-height: 1.6;
            font-size: 16px;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        .content h2 {
            color: #111827;
            font-size: 18px;
            margin-top: 0;
            margin-bottom: 16px;
        }
        .content p {
            margin-top: 0;
            margin-bottom: 16px;
            word-break: break-word;
        }
        .info-box {
            background-color: #f8fafc;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            margin-top: 24px;
            margin-bottom: 24px;
        }
        .info-row {
            margin-bottom: 12px;
            display: flex;
            align-items: flex-start;
            flex-wrap: wrap;
            gap: 8px;
        }
        .info-row:last-child {
            margin-bottom: 0;
        }
        .info-label {
            font-weight: 600;
            color: #4b5563;
            min-width: 100px;
            flex-shrink: 0;
        }
        .info-value {
            color: #111827;
            flex: 1;
            word-break: break-word;
        }
        .btn-container {
            text-align: center;
            margin-top: 32px;
            margin-bottom: 16px;
        }
        .btn {
            display: inline-block;
            background-color: #2563eb;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            transition: background-color 0.2s;
            word-break: break-word;
            max-width: 100%;
        }
        .btn:hover {
            background-color: #1d4ed8;
        }
        .footer {
            background-color: #f9fafb;
            border-top: 1px solid #e5e7eb;
            padding: 20px 15px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
        }
        .footer p {
            margin: 0;
            word-break: break-word;
        }
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 24px 0;
        }

        /* Mobile Responsive Styles */
        @media only screen and (max-width: 640px) {
            body {
                padding: 0 !important;
                margin: 0 !important;
            }
            .wrapper {
                margin: 10px auto;
                border-radius: 8px;
            }
            .header {
                padding: 20px 16px;
            }
            .header h1 {
                font-size: 20px;
                margin: 0;
            }
            .content {
                padding: 20px 16px;
                font-size: 14px;
            }
            .content h2 {
                font-size: 16px;
                margin-bottom: 12px;
            }
            .content p {
                margin-bottom: 12px;
                font-size: 14px;
            }
            .info-box {
                padding: 12px;
                margin-top: 16px;
                margin-bottom: 16px;
            }
            .info-row {
                margin-bottom: 10px;
                flex-direction: column;
                gap: 4px;
            }
            .info-label {
                min-width: auto;
                display: block;
                margin-bottom: 4px;
            }
            .info-value {
                display: block;
            }
            .btn {
                display: block;
                width: 100%;
                max-width: 100%;
                padding: 14px 16px;
                font-size: 14px;
            }
            .btn-container {
                margin-top: 24px;
                margin-bottom: 12px;
            }
            .footer {
                padding: 16px 12px;
                font-size: 11px;
            }
            .footer p {
                margin: 4px 0;
            }
            .divider {
                margin: 16px 0;
            }
        }

        @media only screen and (max-width: 480px) {
            .wrapper {
                margin: 5px auto;
            }
            .header {
                padding: 16px 12px;
            }
            .header h1 {
                font-size: 18px;
            }
            .content {
                padding: 16px 12px;
                font-size: 13px;
            }
            .content h2 {
                font-size: 15px;
            }
            .info-box {
                padding: 10px;
            }
            .btn {
                padding: 12px 14px;
                font-size: 13px;
            }
        }

        /* Outlook specific fixes */
        .ExternalClass {
            width: 100%;
        }
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
            line-height: 100%;
        }
        img {
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: nearest-neighbor;
            border: none;
            max-width: 100%;
            height: auto;
        }
        a img {
            border: none;
        }
        table {
            border-collapse: collapse;
            width: 100%;
        }
        td {
            word-break: break-word;
            word-wrap: break-word;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>${title}</h1>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>IPDIMS </p>
        </div>
    </div>
</body>
</html>
`;
