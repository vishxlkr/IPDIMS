import { baseEmailTemplate } from "./base.js";

export const getRegistrationSuccessEmail = (name) => {
   const content = `
      <p>Hello <strong>${name}</strong>,</p>
      <h2>Welcome to IPDIMS! 🎉</h2>
      <p>We are thrilled to let you know that your account registration was successful. You can now login to your dashboard, manage your profile, and submit your research manuscripts effortlessly.</p>
      
      <div class="info-box">
         <div class="info-row">
             <span class="info-label">Action:</span>
             <span class="info-value">Account Verified</span>
         </div>
         <div class="info-row">
             <span class="info-label">Portal:</span>
             <span class="info-value">Author Dashboard</span>
         </div>
      </div>

      <p>Thank you for participating with IPDIMS. If you have any questions or run into technical issues, please don't hesitate to reach out to our support team.</p>

      <div class="btn-container">
         <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/login" class="btn">Login to Dashboard</a>
      </div>
      <br />
      <p>Best regards,<br />Team IPDIMS</p>
   `;
   return baseEmailTemplate("Registration Successful", content);
};

export const getAuthorSubmissionSuccessEmail = (name, submissionData) => {
   const content = `
      <p>Hello <strong>${name}</strong>,</p>
      <h2>Submission Received</h2>
      <p>We have successfully received your manuscript. Our editorial team will review it shortly. You can track the status of your submission via your dashboard.</p>
      
      <div class="info-box">
         <div class="info-row">
            <span class="info-label">Paper Title:</span>
            <span class="info-value font-semibold">${submissionData.title}</span>
         </div>
         <div class="info-row">
            <span class="info-label">Event:</span>
            <span class="info-value">${submissionData.eventName}</span>
         </div>
      </div>
      
      <p>Thank you for submitting your work to IPDIMS.</p>
      
      
      <br />
      <p>Best regards,<br />Team IPDIMS</p>
   `;
   return baseEmailTemplate("Submission Received", content);
};

export const getAdminNewSubmissionEmail = (
   adminName,
   user,
   submissionData,
   downloadUrl,
   magicLink,
) => {
   const content = `
      <p>Hello <strong>${adminName}</strong>,</p>
      <h2>New Manuscript Submitted</h2>
      <p>A new submission has been authored by <strong>${user.name}</strong> and is awaiting reviewer assignment.</p>
      
      <div class="info-box">
         <div class="info-row">
            <span class="info-label">Author:</span>
            <span class="info-value">${user.name} (${user.email})</span>
         </div>
         <div class="info-row">
            <span class="info-label">Affiliation:</span>
            <span class="info-value">${user.organization || "N/A"}</span>
         </div>
         <div class="divider"></div>
         <div class="info-row">
            <span class="info-label">Title:</span>
            <span class="info-value font-semibold">${submissionData.title}</span>
         </div>
         <div class="info-row">
            <span class="info-label">Event:</span>
            <span class="info-value">${submissionData.eventName}</span>
         </div>
         <div class="divider"></div>
         <div class="info-row">
            <span class="info-label">Attachment:</span>
            <span class="info-value">${downloadUrl ? `<a href="${downloadUrl}" style="color: #2563eb; text-decoration: underline;">Download PDF</a>` : "No attachment"}</span>
         </div>
      </div>

      <p style="margin-top: 24px; font-weight: 600; text-align: center; color: #111827;">Action Required: Assign Reviewers</p>
      <p style="text-align: center;">Click the button below to securely login and instantly open the assignment panel for this paper.</p>
      
      <div class="btn-container">
         <a href="${magicLink}" class="btn">Assign Reviewers</a>
      </div>
      <br />
      <p>System Notification</p>
   `;
   return baseEmailTemplate("Action Required: Assign Reviewers", content);
};

export const getOTPEmail = (otp) => {
   const content = `
      <p>Hello,</p>
      <h2>Verify Your Account</h2>
      <p>Thank you for starting your registration. To complete the process and verify your email address, please use the One-Time Password (OTP) below.</p>
      
      <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; text-align: center; padding: 20px; margin: 24px 0;">
         <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: bold; margin-bottom: 12px;">Your Verification Code</p>
         <span style="font-size: 32px; font-weight: 800; letter-spacing: 0.25em; color: #0f172a; display: block; word-break: break-all;">${otp}</span>
      </div>
      
      <p><strong>Note:</strong> This code will expire in 10 minutes. If you did not request this verification, please ignore this email.</p>
      <br />
      <p>Best regards,<br />Team IPDIMS</p>
   `;
   return baseEmailTemplate("OTP Verification", content);
};

export const getReviewerAssignmentEmail = (
   reviewerName,
   submission,
   magicLink,
) => {
   const content = `
      <p>Hello <strong>${reviewerName}</strong>,</p>
      <h2>New Paper Assigned For Review</h2>
      <p>You have been assigned a new paper for review by the IPDIMS editorial team.</p>
      
      <div class="info-box">
         <div class="info-row">
            <span class="info-label">Paper Title:</span>
            <span class="info-value font-semibold">${submission.title}</span>
         </div>
      </div>
      
      <p style="margin-top: 24px; font-weight: 600; text-align: center; color: #111827;">Action Required: Submit Your Evaluation</p>
      <p style="text-align: center;">Click the secure link below to access the paper directly and complete the evaluation sheet. No manual login is required.</p>
      
      <div class="btn-container">
         <a href="${magicLink}" class="btn">View & Review Paper</a>
      </div>
      <p style="text-align: center; font-size: 12px; color: #6b7280; font-style: italic; margin-top: 8px;">Note: This secure link is valid for 7 days.</p>
      <br />
      <p>Best regards,<br />Team IPDIMS</p>
   `;
   return baseEmailTemplate("Assigned Paper For Review", content);
};

export const getStatusUpdateEmail = (
   userName,
   submission,
   status,
   customMessage,
) => {
   let statusColor = "#2563eb";
   if (status === "Accepted") statusColor = "#16a34a";
   if (status === "Rejected") statusColor = "#dc2626";
   if (status.includes("Revision")) statusColor = "#ea580c";

   const content = `
      <p>Hello <strong>${userName}</strong>,</p>
      <h2>Status Updated for Your Manuscript</h2>
      <p>The evaluation status of your recent submission has been changed by the editorial team.</p>
      
      <div class="info-box">
         <div class="info-row">
            <span class="info-label">Paper Title:</span>
            <span class="info-value font-semibold">${submission.title}</span>
         </div>
         <div class="divider"></div>
         <div class="info-row">
            <span class="info-label">New Status:</span>
            <span class="info-value" style="font-weight: bold; color: ${statusColor}; font-size: 16px;">${status}</span>
         </div>
      </div>

      ${
         customMessage
            ? `
         <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px; margin: 24px 0;">
             <p style="margin-top: 0; font-weight: bold; color: #b45309; font-size: 12px; text-transform: uppercase;">Note from Editor:</p>
             <p style="margin-bottom: 0; color: #451a03; line-height: 1.5; word-break: break-word; white-space: pre-wrap;">${customMessage}</p>
         </div>
      `
            : ""
      }
      
      <p>You may log in to your author dashboard to view feedback documents and the full evaluation sheet if available.</p>
      
      <div class="btn-container">
         <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/dashboard/submissions" class="btn">Go to Dashboard</a>
      </div>
      <br />
      <p>Best regards,<br />Team IPDIMS</p>
   `;
   return baseEmailTemplate("Paper Status Updated", content);
};

export const getFeedbackSentToAuthorEmail = (
   authorName,
   submission,
   feedback,
) => {
   const content = `
      <p>Hello <strong>${authorName || "Author"}</strong>,</p>
      <h2>New Reviewer Feedback Is Available</h2>
      <p>You have received new evaluation feedback from a reviewer for your paper submission.</p>
      
      <div class="info-box">
         <div class="info-row">
            <span class="info-label">Paper Title:</span>
            <span class="info-value font-semibold">${submission.title}</span>
         </div>
         <div class="info-row">
            <span class="info-label">Recommendation:</span>
            <span class="info-value font-bold" style="color: #4b5563;">${feedback.recommendation}</span>
         </div>
      </div>

      <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 12px; margin: 24px 0;">
            <p style="margin-top: 0; font-weight: bold; color: #1e3a8a; font-size: 12px; text-transform: uppercase;">Reviewer Comments:</p>
            <p style="margin-bottom: 0; color: #334155; line-height: 1.5; word-break: break-word; white-space: pre-wrap;">${feedback.comment}</p>
      </div>
      
      <p>Please log in to your IPDIMS dashboard to review the feedback fully and upload a revision if needed.</p>
      
     
      <br />
      <p>Best regards,<br />Team IPDIMS</p>
   `;
   return baseEmailTemplate("Reviewer Feedback Available", content);
};

export const getReviewerRegistrationEmail = (reviewerName, email, password) => {
   const content = `
      <p>Hello <strong>${reviewerName}</strong>,</p>
      <h2>Welcome to IPDIMS as a Reviewer! 🎉</h2>
      <p>Congratulations! You have been registered as a reviewer with IPDIMS. We are excited to have you as part of our reviewing team.</p>
      
      <p>Below are your login credentials. Please keep them secure and do not share them with anyone.</p>
      
      <div style="background-color: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 16px; margin: 24px 0;">
         <p style="margin-top: 0; font-weight: bold; color: #0369a1; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Your Login Credentials</p>
         
         <div class="info-box">
            <div class="info-row">
               <span class="info-label">Email ID:</span>
               <span class="info-value" style="font-family: monospace; font-weight: 600; color: #0f172a;">${email}</span>
            </div>
            <div class="info-row">
               <span class="info-label">Password:</span>
               <span class="info-value" style="font-family: monospace; font-weight: 600; color: #0f172a;">${password}</span>
            </div>
         </div>
      </div>
      
      <p><strong>Important:</strong> We recommend that you change your password immediately after your first login for security purposes.</p>
      
      <p>If you have any questions about your reviewer account or the submission process, please feel free to contact our support team.</p>
      
      <br />
      <p>Best regards,<br />Team IPDIMS</p>
   `;
   return baseEmailTemplate(
      "Reviewer Registration - Login Credentials",
      content,
   );
};

export const getRegistrationApprovalEmail = (name, registration) => {
   const content = `
      <p>Hello <strong>${name}</strong>,</p>
      <h2>Your Conference Registration Is Approved</h2>
      <p>Your submitted registration has been reviewed and approved by the admin team.</p>

      <div class="info-box">
         <div class="info-row">
            <span class="info-label">Paper ID:</span>
            <span class="info-value">#${registration.paperId}</span>
         </div>
         <div class="info-row">
            <span class="info-label">Paper Title:</span>
            <span class="info-value font-semibold">${registration.paperTitle}</span>
         </div>
         <div class="info-row">
            <span class="info-label">Category:</span>
            <span class="info-value">${registration.registrationCategory}</span>
         </div>
         <div class="info-row">
            <span class="info-label">Amount Paid:</span>
            <span class="info-value">₹ ${registration.amountPaid}</span>
         </div>
      </div>

      <p>Thank you for completing your registration. We look forward to your participation.</p>
      
      <br />
      <p>Best regards,<br />Team IPDIMS</p>
   `;

   return baseEmailTemplate("Conference Registration Approved", content);
};

export const getRegistrationRejectionEmail = (name, registration, reason) => {
   const content = `
      <p>Hello <strong>${name}</strong>,</p>
      <h2>Your Conference Registration Was Not Approved</h2>
      <p>Your registration submission has been reviewed, but it could not be approved at this time.</p>

      <div class="info-box">
         <div class="info-row">
            <span class="info-label">Paper ID:</span>
            <span class="info-value">#${registration.paperId}</span>
         </div>
         <div class="info-row">
            <span class="info-label">Paper Title:</span>
            <span class="info-value font-semibold">${registration.paperTitle}</span>
         </div>
      </div>

      <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 12px; margin: 24px 0;">
         <p style="margin-top: 0; font-weight: bold; color: #991b1b; font-size: 12px; text-transform: uppercase;">Reason for non-approval</p>
         <p style="margin-bottom: 0; color: #450a0a; line-height: 1.5; word-break: break-word; white-space: pre-wrap;">${reason}</p>
      </div>

      <p>Please update your registration/payment details if needed and contact the support team for help.</p>
      <br />
      <p>Best regards,<br />Team IPDIMS</p>
   `;

   return baseEmailTemplate("Conference Registration Update", content);
};

export const getAllReviewersFeedbackCompleteEmail = (
   adminName,
   submission,
   feedbackCount,
   reviewerCount,
   magicLink,
) => {
   const fallbackUrl = `${process.env.ADMIN_URL || "http://localhost:5174"}/admin/submissions`;
   const targetUrl = magicLink || fallbackUrl;

   const content = `
      <p>Hello <strong>${adminName}</strong>,</p>
      <h2>All Reviewer Feedbacks Received</h2>
      <p>All assigned reviewers have submitted their feedback for the following paper. You can now review the evaluations and make a final decision.</p>
      
      <div class="info-box">
         <div class="info-row">
            <span class="info-label">Paper ID:</span>
            <span class="info-value">#${submission.paperId}</span>
         </div>
         <div class="info-row">
            <span class="info-label">Title:</span>
            <span class="info-value font-semibold">${submission.title}</span>
         </div>
         <div class="info-row">
            <span class="info-label">Author:</span>
            <span class="info-value">${submission.authorName} (${submission.authorEmail})</span>
         </div>
         <div class="info-row">
            <span class="info-label">Feedback Status:</span>
            <span class="info-value font-bold" style="color: #16a34a;">${feedbackCount}/${reviewerCount} Complete</span>
         </div>
      </div>

      <p style="margin-top: 24px; font-weight: 600; text-align: center; color: #111827;">Action Required: Review Feedback & Decide</p>
      <p style="text-align: center;">Please log in to the admin panel to view all feedback and make a final decision on this paper.</p>
      
      <div class="btn-container">
         <a href="${targetUrl}" class="btn">View Feedback</a>
      </div>
      <br />
      <p>Best regards,<br />IPDIMS System</p>
   `;
   return baseEmailTemplate("All Reviewer Feedbacks Complete", content);
};

export const getAdminRevisionSubmissionEmail = (
   adminName,
   user,
   submission,
   downloadUrl,
) => {
   const content = `
      <p>Hello <strong>${adminName}</strong>,</p>
      <h2>Revised Manuscript Submitted</h2>
      <p>The author has submitted a revised version of their paper following the revision request.</p>
      
      <div class="info-box">
         <div class="info-row">
            <span class="info-label">Author:</span>
            <span class="info-value">${user.name} (${user.email})</span>
         </div>
         <div class="info-row">
            <span class="info-label">Affiliation:</span>
            <span class="info-value">${user.organization || "N/A"}</span>
         </div>
         <div class="divider"></div>
         <div class="info-row">
            <span class="info-label">Paper ID:</span>
            <span class="info-value">#${submission.paperId}</span>
         </div>
         <div class="info-row">
            <span class="info-label">Title:</span>
            <span class="info-value font-semibold">${submission.title}</span>
         </div>
         <div class="info-row">
            <span class="info-label">Event:</span>
            <span class="info-value">${submission.eventName}</span>
         </div>
         <div class="divider"></div>
         <div class="info-row">
            <span class="info-label">Attachment:</span>
            <span class="info-value">${downloadUrl ? `<a href="${downloadUrl}" style="color: #2563eb; text-decoration: underline;">Download Revised PDF</a>` : "No attachment"}</span>
         </div>
      </div>

      <p style="margin-top: 24px; font-weight: 600; text-align: center; color: #111827;">Action Required: Review Revision</p>
      <p style="text-align: center;">The revised manuscript is now under review. You may need to reassign reviewers or proceed with evaluation.</p>
      
      <br />
      <p>System Notification</p>
   `;
   return baseEmailTemplate("Revised Manuscript Submitted", content);
};
