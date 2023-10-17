using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Data
{
    public class PlaylistSongs
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int IdSong { get; set; }

        [Required]
        public int PlaylistId { get; set; }

        [ForeignKey("PlaylistId")]
        public Playlist Playlist { get; set; }

        [ForeignKey("IdSong")]
        public Song Song { get; set; }
    }
}
