using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public partial class Property
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [StringLength(255, ErrorMessage = "Name cannot exceed 255 characters")]
        public string PropertyName { get; set; } = null!;

        public virtual ICollection<Paper> Papers { get; set; } = new List<Paper>();
    }
}