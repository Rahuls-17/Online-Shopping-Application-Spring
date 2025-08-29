package com.project.shopapp.service;

import com.project.shopapp.model.Order;
import com.project.shopapp.model.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private EmailService emailService;

    public void sendOrderConfirmation(Order order) {
        String recipientEmail = order.getUser().getEmail();
        String subject = "Your ShopApp Order #" + order.getId() + " is Confirmed!";
        String htmlBody = buildOrderConfirmationHtml(order);

        emailService.sendHtmlEmail(recipientEmail, subject, htmlBody);
    }

    private String buildOrderConfirmationHtml(Order order) {
        StringBuilder sb = new StringBuilder();
        sb.append("<html><body style='font-family: Arial, sans-serif; color: #333;'>");
        sb.append("<h2 style='color: #0056b3;'>Thank you for your order!</h2>");
        sb.append("<p>Hi ").append(order.getUser().getName()).append(",</p>");
        sb.append("<p>Your order with ID <strong>#").append(order.getId()).append("</strong> has been confirmed.</p>");
        sb.append("<h3>Order Summary</h3>");
        sb.append(
                "<table border='1' cellpadding='10' cellspacing='0' style='border-collapse: collapse; width: 100%;'>");
        sb.append(
                "<thead style='background-color: #f2f2f2;'><tr><th>Product</th><th>Quantity</th><th>Price</th></tr></thead><tbody>");

        for (OrderItem item : order.getOrderItems()) {
            sb.append("<tr>");
            sb.append("<td>").append(item.getProduct().getName()).append("</td>");
            sb.append("<td style='text-align: center;'>").append(item.getQuantity()).append("</td>");
            sb.append("<td style='text-align: right;'>₹").append(String.format("%.2f", item.getPrice()))
                    .append("</td>");
            sb.append("</tr>");
        }

        sb.append("</tbody></table>");
        sb.append("<h4 style='text-align: right;'>Total: ₹").append(String.format("%.2f", order.getTotalAmount()))
                .append("</h4>");
        sb.append("<h3>Shipping Address</h3>");
        sb.append("<p>").append(order.getAddress().replace("\n", "<br>")).append("</p>");
        sb.append("<p>Thank you for shopping with us!</p>");
        sb.append("<p>The ShopApp Team</p>");
        sb.append("</body></html>");

        return sb.toString();
    }

    public void sendOrderStatusUpdate(Order order, String oldStatus) {
        String recipientEmail = order.getUser().getEmail();
        String subject = "Update on your ShopApp Order #" + order.getId();
        String htmlBody = buildOrderStatusUpdateHtml(order, oldStatus);

        emailService.sendHtmlEmail(recipientEmail, subject, htmlBody);
    }

    private String buildOrderStatusUpdateHtml(Order order, String oldStatus) {
        String newStatus = order.getStatus();
        StringBuilder sb = new StringBuilder();
        sb.append("<html><body style='font-family: Arial, sans-serif; color: #333;'>");
        sb.append("<h2 style='color: #0056b3;'>Your Order Status Has Been Updated</h2>");
        sb.append("<p>Hi ").append(order.getUser().getName()).append(",</p>");
        sb.append("<p>This is a notification that the status of your order with ID <strong>#").append(order.getId())
                .append("</strong> has been changed.</p>");
        sb.append("<p style='font-size: 16px;'>");
        sb.append("Previous Status: <strong style='color: #6c757d;'>").append(oldStatus).append("</strong><br>");
        sb.append("New Status: <strong style='color: #198754;'>").append(newStatus).append("</strong>");
        sb.append("</p>");

        if ("SHIPPED".equalsIgnoreCase(newStatus)) {
            sb.append("<p>Your order is on its way! You can expect it to arrive soon.</p>");
        } else if ("DELIVERED".equalsIgnoreCase(newStatus)) {
            sb.append("<p>Your order has been delivered. We hope you enjoy your purchase!</p>");
        } else if ("CANCELLED".equalsIgnoreCase(newStatus)) {
            sb.append("<p>Your order has been cancelled. A refund for the full amount has been processed.</p>");
            if (order.getCancellationReason() != null && !order.getCancellationReason().isEmpty()) {
                sb.append("<p><strong>Reason:</strong> ").append(order.getCancellationReason()).append("</p>");
            }
        }

        sb.append("<h4>Order Summary</h4>");
        sb.append("<p>Total Amount: <strong>₹").append(String.format("%.2f", order.getTotalAmount()))
                .append("</strong></p>");
        sb.append("<p>Thank you for shopping with us!</p>");
        sb.append("<p>The ShopApp Team</p>");
        sb.append("</body></html>");

        return sb.toString();
    }
}
