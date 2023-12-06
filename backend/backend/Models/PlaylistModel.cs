using backend.Data;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class PlaylistModel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string IdUser { get; set; }

        [Required]
        public string NamePlaylist { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public string Access { get; set; }

        [Required]
        public string NumberTrack { get; set; }
        public List<int> IdSongList { get; set; }
        public string ImgFirstSong { get; set; }
    }
}
