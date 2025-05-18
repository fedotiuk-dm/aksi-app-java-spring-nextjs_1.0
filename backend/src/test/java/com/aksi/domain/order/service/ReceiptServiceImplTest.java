package com.aksi.domain.order.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

import com.aksi.domain.branch.entity.BranchLocationEntity;
import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.order.dto.receipt.ReceiptDTO;
import com.aksi.domain.order.dto.receipt.ReceiptGenerationRequest;
import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.entity.OrderItemEntity;
import com.aksi.domain.order.model.ExpediteType;
import com.aksi.domain.order.model.PaymentMethod;
import com.aksi.domain.order.pdf.ReceiptPdfRenderer;
import com.aksi.domain.order.repository.CustomerSignatureRepository;
import com.aksi.domain.order.repository.OrderItemRepository;
import com.aksi.domain.order.repository.OrderRepository;
import com.aksi.domain.order.repository.PriceModifierRepository;
import com.aksi.exception.ResourceNotFoundException;

@ExtendWith(MockitoExtension.class)
public class ReceiptServiceImplTest {

    @Mock
    private OrderRepository orderRepository;
    
    @Mock
    private OrderItemRepository orderItemRepository;
    
    @Mock
    private CustomerSignatureRepository customerSignatureRepository;
    
    @Mock
    private PriceModifierRepository priceModifierRepository;
    
    @Mock
    private ReceiptPdfRenderer pdfRenderer;
    
    @Mock
    private JavaMailSender emailSender;
    
    @InjectMocks
    private ReceiptServiceImpl receiptService;
    
    private UUID orderId;
    private OrderEntity mockOrder;
    private ClientEntity mockClient;
    private BranchLocationEntity mockBranch;
    private List<OrderItemEntity> mockItems;
    
    @BeforeEach
    public void setup() {
        // Ініціалізуємо тестові дані
        orderId = UUID.randomUUID();
        
        // Клієнт
        mockClient = new ClientEntity();
        mockClient.setId(UUID.randomUUID());
        mockClient.setFirstName("Іван");
        mockClient.setLastName("Петренко");
        mockClient.setPhone("+380501234567");
        mockClient.setEmail("ivan@example.com");
        
        // Філія
        mockBranch = new BranchLocationEntity();
        mockBranch.setId(UUID.randomUUID());
        mockBranch.setName("Центральна філія AKSI");
        mockBranch.setAddress("вул. Хрещатик, 1, Київ");
        mockBranch.setPhone("+380443334455");
        
        // Замовлення
        mockOrder = new OrderEntity();
        mockOrder.setId(orderId);
        mockOrder.setClient(mockClient);
        mockOrder.setBranchLocation(mockBranch);
        mockOrder.setCreatedDate(LocalDateTime.now());
        mockOrder.setExpectedCompletionDate(LocalDateTime.now().plusDays(3));
        mockOrder.setReceiptNumber("AKSI-" + System.currentTimeMillis());
        mockOrder.setTagNumber("TAG-12345");
        mockOrder.setExpediteType(ExpediteType.STANDARD);
        mockOrder.setPaymentMethod(PaymentMethod.CASH);
        mockOrder.setTotalAmount(new BigDecimal("500.00"));
        mockOrder.setFinalAmount(new BigDecimal("500.00"));
        
        // Предмети замовлення
        mockItems = new ArrayList<>();
        OrderItemEntity item1 = new OrderItemEntity();
        item1.setId(UUID.randomUUID());
        item1.setOrder(mockOrder);
        item1.setName("Куртка зимова");
        item1.setCategory("Верхній одяг");
        item1.setQuantity(1);
        item1.setUnitOfMeasure("шт");
        item1.setUnitPrice(new BigDecimal("300.00"));
        item1.setTotalPrice(new BigDecimal("300.00"));
        
        OrderItemEntity item2 = new OrderItemEntity();
        item2.setId(UUID.randomUUID());
        item2.setOrder(mockOrder);
        item2.setName("Штани");
        item2.setCategory("Штани");
        item2.setQuantity(1);
        item2.setUnitOfMeasure("шт");
        item2.setUnitPrice(new BigDecimal("200.00"));
        item2.setTotalPrice(new BigDecimal("200.00"));
        
        mockItems.add(item1);
        mockItems.add(item2);
    }
    
    @Test
    public void testGenerateReceipt() {
        // Given
        ReceiptGenerationRequest request = new ReceiptGenerationRequest(orderId, "PDF", true);
        
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(mockOrder));
        when(orderItemRepository.findByOrderId(orderId)).thenReturn(mockItems);
        when(customerSignatureRepository.findByOrderIdAndSignatureType(eq(orderId), anyString()))
                .thenReturn(Optional.empty());
        when(priceModifierRepository.findByOrderItemId(any(UUID.class))).thenReturn(new ArrayList<>());
        
        // When
        ReceiptDTO receiptDTO = receiptService.generateReceipt(request);
        
        // Then
        assertNotNull(receiptDTO);
        assertEquals(orderId, receiptDTO.getOrderId());
        assertEquals(mockOrder.getReceiptNumber(), receiptDTO.getReceiptNumber());
        assertEquals(mockOrder.getTagNumber(), receiptDTO.getTagNumber());
        assertEquals(mockClient.getFirstName(), receiptDTO.getClientInfo().getFirstName());
        assertEquals(mockClient.getLastName(), receiptDTO.getClientInfo().getLastName());
        assertEquals(mockBranch.getName(), receiptDTO.getBranchInfo().getBranchName());
        assertEquals(2, receiptDTO.getItems().size());
        
        // Перевіряємо перший предмет
        assertEquals("Куртка зимова", receiptDTO.getItems().get(0).getName());
        assertEquals(new BigDecimal("300.00"), receiptDTO.getItems().get(0).getFinalPrice());
    }
    
    @Test
    public void testGeneratePdfReceipt() {
        // Given
        ReceiptGenerationRequest request = new ReceiptGenerationRequest(orderId, "PDF", true);
        byte[] mockPdfData = "Mock PDF Content".getBytes();
        
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(mockOrder));
        when(orderItemRepository.findByOrderId(orderId)).thenReturn(mockItems);
        when(priceModifierRepository.findByOrderItemId(any(UUID.class))).thenReturn(new ArrayList<>());
        when(pdfRenderer.generatePdfReceipt(any(ReceiptDTO.class), anyBoolean())).thenReturn(mockPdfData);
        
        // When
        byte[] pdfData = receiptService.generatePdfReceipt(request);
        
        // Then
        assertNotNull(pdfData);
        verify(pdfRenderer).generatePdfReceipt(any(ReceiptDTO.class), eq(true));
    }
    
    @Test
    public void testGenerateReceiptForNonExistingOrder() {
        // Given
        UUID nonExistingOrderId = UUID.randomUUID();
        ReceiptGenerationRequest request = new ReceiptGenerationRequest(nonExistingOrderId, "PDF", true);
        
        when(orderRepository.findById(nonExistingOrderId)).thenReturn(Optional.empty());
        
        // When & Then
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            receiptService.generateReceipt(request);
        });
        
        // Перевіряємо деталі винятку
        assertTrue(exception.getMessage().contains("not found"));
    }
    
    @Test
    public void testGeneratePdfReceiptAndSaveToFile() throws Exception {
        // Given
        ReceiptGenerationRequest request = new ReceiptGenerationRequest(orderId, "PDF", true);
        byte[] mockPdfData = "Mock PDF Content".getBytes();
        
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(mockOrder));
        when(orderItemRepository.findByOrderId(orderId)).thenReturn(mockItems);
        when(priceModifierRepository.findByOrderItemId(any(UUID.class))).thenReturn(new ArrayList<>());
        when(pdfRenderer.generatePdfReceipt(any(ReceiptDTO.class), anyBoolean())).thenReturn(mockPdfData);
        
        // When
        byte[] pdfData = receiptService.generatePdfReceipt(request);
        
        // Then
        assertNotNull(pdfData);
        
        // Зберігаємо PDF у тимчасовий файл (для тестування)
        java.nio.file.Path tempDir = java.nio.file.Files.createTempDirectory("receipt-test");
        java.nio.file.Path outputPath = tempDir.resolve("test-receipt.pdf");
        
        try {
            java.nio.file.Files.write(outputPath, pdfData);
            
            // Перевіряємо, що файл існує та має правильний розмір
            assertTrue(java.nio.file.Files.exists(outputPath));
            assertEquals(mockPdfData.length, java.nio.file.Files.size(outputPath));
            
            System.out.println("PDF файл збережено: " + outputPath.toAbsolutePath().toString());
        } finally {
            // Видаляємо тимчасові файли після тесту
            java.nio.file.Files.deleteIfExists(outputPath);
            java.nio.file.Files.deleteIfExists(tempDir);
        }
    }
} 