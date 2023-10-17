using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class UserProfileModel
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Token { get; set; }
    }
}
