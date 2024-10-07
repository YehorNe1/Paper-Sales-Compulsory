using System.ComponentModel.DataAnnotations;

namespace server.DTOs
{
    public class PropertyDTO
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [StringLength(255, ErrorMessage = "Name cannot exceed 255 characters")]
        public string PropertyName { get; set; } = null!;

        // Exclude Papers to prevent circular references
    }
}