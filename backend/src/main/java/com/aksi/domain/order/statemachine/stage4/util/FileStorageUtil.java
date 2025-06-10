package com.aksi.domain.order.statemachine.stage4.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * Утилітний клас для роботи з файловою системою.
 * Забезпечує збереження PDF файлів у папку Downloads користувача.
 */
public class FileStorageUtil {

    private static final String RECEIPTS_FOLDER = "Aksi_Receipts";
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");

    /**
     * Отримує шлях до папки Downloads користувача.
     *
     * @return Path до папки Downloads
     */
    public static Path getDownloadsPath() {
        String userHome = System.getProperty("user.home");
        String os = System.getProperty("os.name").toLowerCase();

        if (os.contains("windows")) {
            // Windows: C:\Users\{username}\Downloads
            return Paths.get(userHome, "Downloads");
        } else if (os.contains("mac")) {
            // macOS: /Users/{username}/Downloads
            return Paths.get(userHome, "Downloads");
        } else {
            // Linux та інші Unix системи: /home/{username}/Downloads
            return Paths.get(userHome, "Downloads");
        }
    }

    /**
     * Отримує шлях до папки квитанцій у Downloads.
     *
     * @return Path до папки Aksi_Receipts
     * @throws IOException якщо не вдалося створити папку
     */
    public static Path getReceiptsPath() throws IOException {
        Path downloadsPath = getDownloadsPath();
        Path receiptsPath = downloadsPath.resolve(RECEIPTS_FOLDER);

        // Створюємо папку якщо не існує
        if (!Files.exists(receiptsPath)) {
            Files.createDirectories(receiptsPath);
        }

        return receiptsPath;
    }

    /**
     * Генерує унікальне ім'я файлу для квитанції.
     *
     * @param orderId ID замовлення
     * @param orderNumber номер замовлення (якщо є)
     * @return унікальне ім'я файлу
     */
    public static String generateReceiptFileName(UUID orderId, String orderNumber) {
        String timestamp = LocalDateTime.now().format(DATE_FORMAT);

        if (orderNumber != null && !orderNumber.trim().isEmpty()) {
            return String.format("receipt_%s_%s.pdf", orderNumber, timestamp);
        } else {
            return String.format("receipt_%s_%s.pdf", orderId.toString().substring(0, 8), timestamp);
        }
    }

    /**
     * Створює повний шлях до файлу квитанції.
     *
     * @param orderId ID замовлення
     * @param orderNumber номер замовлення (якщо є)
     * @return повний шлях до файлу
     * @throws IOException якщо не вдалося створити папку
     */
    public static Path createReceiptFilePath(UUID orderId, String orderNumber) throws IOException {
        Path receiptsPath = getReceiptsPath();
        String fileName = generateReceiptFileName(orderId, orderNumber);
        return receiptsPath.resolve(fileName);
    }

    /**
     * Зберігає PDF файл квитанції.
     *
     * @param pdfBytes дані PDF файлу
     * @param orderId ID замовлення
     * @param orderNumber номер замовлення (якщо є)
     * @return шлях до збереженого файлу
     * @throws IOException якщо не вдалося зберегти файл
     */
    public static String savePdfReceipt(byte[] pdfBytes, UUID orderId, String orderNumber) throws IOException {
        Path filePath = createReceiptFilePath(orderId, orderNumber);
        Files.write(filePath, pdfBytes);
        return filePath.toAbsolutePath().toString();
    }

    /**
     * Перевіряє чи існує папка Downloads і чи є права на запис.
     *
     * @return true якщо папка доступна для запису
     */
    public static boolean isDownloadsAccessible() {
        try {
            Path downloadsPath = getDownloadsPath();
            return Files.exists(downloadsPath) && Files.isWritable(downloadsPath);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Отримує розмір папки з квитанціями в байтах.
     *
     * @return розмір папки або -1 якщо помилка
     */
    public static long getReceiptsFolderSize() {
        try {
            Path receiptsPath = getReceiptsPath();
            if (!Files.exists(receiptsPath)) {
                return 0;
            }

            return Files.walk(receiptsPath)
                    .filter(Files::isRegularFile)
                    .mapToLong(path -> {
                        try {
                            return Files.size(path);
                        } catch (IOException e) {
                            return 0;
                        }
                    })
                    .sum();
        } catch (IOException e) {
            return -1;
        }
    }

    /**
     * Очищає старі файли квитанцій (старші за N днів).
     *
     * @param daysOld кількість днів
     * @return кількість видалених файлів
     */
    public static int cleanOldReceipts(int daysOld) {
        try {
            Path receiptsPath = getReceiptsPath();
            if (!Files.exists(receiptsPath)) {
                return 0;
            }

            long cutoffTime = System.currentTimeMillis() - (daysOld * 24L * 60L * 60L * 1000L);

            return (int) Files.walk(receiptsPath)
                    .filter(Files::isRegularFile)
                    .filter(path -> {
                        try {
                            return Files.getLastModifiedTime(path).toMillis() < cutoffTime;
                        } catch (IOException e) {
                            return false;
                        }
                    })
                    .peek(path -> {
                        try {
                            Files.delete(path);
                        } catch (IOException e) {
                            // Логуємо помилку, але продовжуємо
                        }
                    })
                    .mapToInt(path -> 1)
                    .sum();
        } catch (IOException e) {
            return 0;
        }
    }
}
