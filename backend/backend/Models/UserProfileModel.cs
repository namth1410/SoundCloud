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
        public string? PhoneNumber { get; set; }
        public string? Avatar { get; set; }
        [Required]
        public string Token { get; set; }
    }
}
