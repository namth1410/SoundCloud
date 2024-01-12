using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class PlaylistModelV2
    {
        [Required]
        public string NamePlaylist { get; set; }

        [Required]
        public string Access { get; set; }

    }
}
