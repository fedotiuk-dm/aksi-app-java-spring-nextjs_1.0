package com.aksi.service.email.impl;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailParseException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.aksi.service.email.EmailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Імплементація сервісу для відправки електронних листів.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender emailSender;

    @Override
    public boolean sendEmail(String to, String subject, String content) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content);
            emailSender.send(message);
            log.info("Email successfully sent to {}", to);
            return true;
        } catch (MailSendException | MailAuthenticationException | MailParseException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage(), e);
            return false;
        } catch (RuntimeException e) {
            log.error("Unexpected error when sending email to {}: {}", to, e.getMessage(), e);
            return false;
        }
    }

    @Override
    public boolean sendEmailWithAttachment(String to, String subject, String content,
                                         String attachmentFilename, byte[] attachmentData,
                                         String attachmentContentType) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content);

            ByteArrayResource attachmentResource = new ByteArrayResource(attachmentData);
            helper.addAttachment(attachmentFilename, attachmentResource, attachmentContentType);

            emailSender.send(message);
            log.info("Email with attachment successfully sent to {}", to);
            return true;
        } catch (MessagingException e) {
            log.error("Failed to create email message with attachment to {}: {}", to, e.getMessage(), e);
            return false;
        } catch (MailSendException | MailAuthenticationException | MailParseException e) {
            log.error("Failed to send email with attachment to {}: {}", to, e.getMessage(), e);
            return false;
        } catch (RuntimeException e) {
            log.error("Unexpected error when sending email with attachment to {}: {}", to, e.getMessage(), e);
            return false;
        }
    }
}
