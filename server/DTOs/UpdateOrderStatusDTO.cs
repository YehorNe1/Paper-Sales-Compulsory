using System.ComponentModel.DataAnnotations;

namespace server.DTOs
{
    public class UpdateOrderStatusDTO
    {
        [Required(ErrorMessage = "Status is required")]
        [StringLength(50, ErrorMessage = "Status cannot be more than 50 characters")]
        public string Status { get; set; } = null!;
    }
}