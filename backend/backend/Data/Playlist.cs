using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Data
{
    public class Playlist
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string IdUser { get; set; }

        [Required]
        public string NamePlaylist { get; set; }


        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public string Access { get; set; }
    }
}
