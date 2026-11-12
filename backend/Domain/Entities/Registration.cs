using Domain.Enums;

namespace Domain.Entities;

public class Registration
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    // 1. Registration Number (format: CS27-0001, etc.)
    public string RegistrationNumber { get; set; } = string.Empty;
    
    // 2. Registration Date (UTC)
    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
    
    // 3. Participant Name (Required, max 150)
    public string ParticipantName { get; set; } = string.Empty;
    
    // 4. Contact Number (Required, 11 digits 09XXXXXXXXX)
    public string ContactNumber { get; set; } = string.Empty;
    
    // 5. Email (Required, max 200)
    public string Email { get; set; } = string.Empty;
    
    // 6. Address (Required, max 300)
    public string Address { get; set; } = string.Empty;
    
    // 7. Car Make & Model (Required, max 100)
    public string CarMakeModel { get; set; } = string.Empty;
    
    // 8. Plate Number (Required, max 15, unique)
    public string PlateNumber { get; set; } = string.Empty;
    
    // 9. Registration Type (Exhibitor, Competitor, VIP)
    public RegistrationType RegistrationType { get; set; }
    
    // 10. Status (Pending, Confirmed, CheckedIn, Cancelled)
    public Status Status { get; set; } = Status.Pending;
    
    // 11. Registration Fee (Set by server based on type)
    public decimal RegistrationFee { get; set; }
    
    // 12. Amount Paid (Up to RegistrationFee)
    public decimal AmountPaid { get; set; }

    // Computed Payment Status (Unpaid, Partial, Paid)
    public string PaymentStatus
    {
        get
        {
            if (AmountPaid <= 0) return "Unpaid";
            if (AmountPaid < RegistrationFee) return "Partial";
            return "Paid";
        }
    }
}