using System.ComponentModel.DataAnnotations;

namespace server.DTOs
{
    public class AssignPropertyDto
    {
        [Required]
        public int PaperId { get; set; }

        [Required]
        public int PropertyId { get; set; }
    }
}