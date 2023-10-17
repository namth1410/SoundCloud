using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class PlaylistModel
    {
        [Required]
        public string NamePlaylist { get; set; }
        [Required]
        public string Access { get; set; }
    }
}
