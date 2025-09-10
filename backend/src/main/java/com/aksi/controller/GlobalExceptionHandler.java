package com.aksi.controller;

import java.util.Map;

import org.apache.catalina.connector.ClientAbortException;
import org.hibernate.PropertyValueException;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.async.AsyncRequestNotUsableException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.aksi.exception.BadRequestException;
import com.aksi.exception.ConflictException;
import com.aksi.exception.NotFoundException;
import com.aksi.exception.UnauthorizedException;
import com.aksi.exception.handler.AuthenticationExceptionHandler;
import com.aksi.exception.handler.DatabaseExceptionHandler;
import com.aksi.exception.handler.RuntimeExceptionHandler;
import com.aksi.exception.handler.ValidationExceptionHandler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Global exception handler for REST API.
 * Refactored to follow SOLID principles with delegation to specialized handlers.
 * Reduced from 511 to ~150 lines with improved maintainability and correlation context.
 */
@RestControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class GlobalExceptionHandler {

    private final AuthenticationExceptionHandler authHandler;
    private final ValidationExceptionHandler validationHandler;
    private final DatabaseExceptionHandler databaseHandler;
    private final RuntimeExceptionHandler runtimeHandler;

    // === AUTHENTICATION & AUTHORIZATION ===

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Map<String, Object>> handleUnauthorized(UnauthorizedException e) {
        return authHandler.handleUnauthorized(e);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(BadCredentialsException e) {
        return authHandler.handleBadCredentials(e);
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<Map<String, Object>> handleDisabled(DisabledException e) {
        return authHandler.handleDisabled(e);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthentication(AuthenticationException e) {
        return authHandler.handleAuthentication(e);
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAuthorizationDenied(AuthorizationDeniedException e) {
        return authHandler.handleAuthorizationDenied(e);
    }

    // === VALIDATION & REQUEST PARSING ===

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException e) {
        return validationHandler.handleValidation(e);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> handleMethodArgumentTypeMismatch(
            MethodArgumentTypeMismatchException e) {
        return validationHandler.handleMethodArgumentTypeMismatch(e);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleJsonParseError(HttpMessageNotReadableException e) {
        return validationHandler.handleJsonParseError(e);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<Map<String, Object>> handleMediaTypeNotSupported(
            HttpMediaTypeNotSupportedException e) {
        return validationHandler.handleMediaTypeNotSupported(e);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String, Object>> handleDomainBadRequest(BadRequestException e) {
        return validationHandler.handleDomainBadRequest(e);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException e) {
        return validationHandler.handleIllegalArgument(e);
    }

    // === DATABASE & DATA ACCESS ===

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(NotFoundException e) {
        return databaseHandler.handleNotFound(e);
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<Map<String, Object>> handleConflict(ConflictException e) {
        return databaseHandler.handleConflict(e);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(
            DataIntegrityViolationException e) {
        return databaseHandler.handleDataIntegrityViolation(e);
    }

    @ExceptionHandler(JpaSystemException.class)
    public ResponseEntity<Map<String, Object>> handleJpaSystemException(JpaSystemException e) {
        return databaseHandler.handleJpaSystemException(e);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleConstraintViolation(ConstraintViolationException e) {
        return databaseHandler.handleConstraintViolation(e);
    }

    @ExceptionHandler(PropertyValueException.class)
    public ResponseEntity<Map<String, Object>> handlePropertyValue(PropertyValueException e) {
        return databaseHandler.handlePropertyValue(e);
    }

    @ExceptionHandler(IncorrectResultSizeDataAccessException.class)
    public ResponseEntity<Map<String, Object>> handleIncorrectResultSize(
            IncorrectResultSizeDataAccessException e) {
        return databaseHandler.handleIncorrectResultSize(e);
    }

    @ExceptionHandler(InvalidDataAccessApiUsageException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidDataAccess(InvalidDataAccessApiUsageException e) {
        return databaseHandler.handleInvalidDataAccess(e);
    }

    // === RUNTIME & GENERAL EXCEPTIONS ===

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(RuntimeException e) {
        return runtimeHandler.handleRuntime(e);
    }

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<Map<String, Object>> handleNullPointer(NullPointerException e) {
        return runtimeHandler.handleNullPointer(e);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<?> handleNoResourceFound(NoResourceFoundException e) {
        return runtimeHandler.handleNoResourceFound(e);
    }

    @ExceptionHandler({AsyncRequestNotUsableException.class, ClientAbortException.class})
    public void handleAsyncRequestErrors(Exception e) {
        runtimeHandler.handleAsyncRequestErrors(e);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(Exception e) {
        return runtimeHandler.handleGeneral(e);
    }
}
