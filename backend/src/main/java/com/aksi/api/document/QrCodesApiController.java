package com.aksi.api.document;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.aksi.api.document.dto.GenerateQRCodeRequest;
import com.aksi.api.document.dto.QRCodeResponse;
import com.aksi.domain.document.service.QrCodeService;

import lombok.RequiredArgsConstructor;

/**
 * HTTP Controller для QrCodesApi
 * Відповідальність: тільки HTTP делегація до QrCodeService
 */
@Controller
@RequiredArgsConstructor
public class QrCodesApiController implements QrCodesApi {

    private final QrCodeService qrCodeService;

    @Override
    public ResponseEntity<QRCodeResponse> generateQrCode(GenerateQRCodeRequest generateQRCodeRequest) {
        QRCodeResponse response = qrCodeService.generateQRCode(generateQRCodeRequest);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<org.springframework.core.io.Resource> getQrCodeById(
            UUID id,
            com.aksi.api.document.dto.QRCodeFormat format,
            Integer size) {
        // TODO: Реалізувати отримання QR коду як Resource
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }
}
