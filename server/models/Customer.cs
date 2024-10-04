using System.ComponentModel.DataAnnotations;

namespace server.Models;

public partial class Customer
{
    public int Id { get; set; }
    
    [Required(ErrorMessage = "Please enter a name")]
    [StringLength(255, ErrorMessage = "Name cannot be more than 255 characters")]
    public string Name { get; set; } = null!;

    [StringLength(255, ErrorMessage = "Address cannot be more than 255 characters")]
    public string? Address { get; set; }

    [Phone(ErrorMessage = "Invalid phone number format")]
    [StringLength(50, ErrorMessage = "Phone number cannot be more than 50 characters")]
    public string? Phone { get; set; }

    [EmailAddress(ErrorMessage = "Invalid email address format")]
    [StringLength(255, ErrorMessage = "Email cannot be more than 255 characters")]
    public string? Email { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}