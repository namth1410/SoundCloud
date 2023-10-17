using backend.Data;
using backend.Migrations;
using backend.Models;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlaylistController : ControllerBase
    {
        private readonly SoundCloudContext _context;
        private readonly ISongRepository _songRepository;
        private readonly UserManager<Account> _userManager;
        public PlaylistController(SoundCloudContext context, ISongRepository songRepository, UserManager<Account> userManager)
        {
            _context = context;
            _songRepository = songRepository;
            _userManager = userManager;
        }

        [Authorize]
        [HttpGet("getPlaylists")]
        public async Task<ActionResult<IEnumerable<Playlist>>> GetPlaylists()
        {

            if (_context.Playlist == null)
            {
                return NotFound();
            }
            var identity = (ClaimsIdentity)User.Identity;
            var idUser = identity.FindFirst("idUser").Value;

            var playlists = await _context.Playlist
                .Where(ps => ps.IdUser == idUser)
                .ToListAsync();

            return Ok(playlists);
        }

        [Authorize]
        [HttpPost("postPlaylist")]
        public async Task<ActionResult> PostPlaylist([FromBody] PlaylistModel playlist)
        {
            //var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var identity = (ClaimsIdentity)User.Identity;
            var userId = identity.FindFirst("idUser").Value;

            // Kiểm tra xem playlist đã tồn tại chưa
            var existingPlaylist = await _context.Playlist
                .FirstOrDefaultAsync(p => (p.IdUser == userId || p.IdUser == null) && p.NamePlaylist == playlist.NamePlaylist);

            if (existingPlaylist != null)
            {
                // Nếu đã tồn tại, bạn có thể xử lý tương ứng, ví dụ: trả về lỗi hoặc thông báo rằng đã tồn tại.
                return BadRequest("Dòng dữ liệu đã tồn tại.");
            }

            var _playlist = new Playlist
            {
                IdUser = userId,
                CreatedAt = DateTime.UtcNow,
                Access = playlist.Access,
                NamePlaylist = playlist.NamePlaylist,
            };

            _context.Playlist.Add(_playlist);
            await _context.SaveChangesAsync();


            var playlists = await _context.Playlist
                .Where(ps => ps.IdUser == userId)
                .ToListAsync();
            return Ok(playlists);
        }

        [Authorize]
        [HttpPut("putPlaylist")]
        public async Task<ActionResult> PutPlaylist([FromQuery] string idPlaylist, string access, string namePlaylist)
        {
            //var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var identity = (ClaimsIdentity)User.Identity;
            var userId = identity.FindFirst("idUser").Value;

            var existingPlaylist = await _context.Playlist.FirstOrDefaultAsync(p => p.Id == int.Parse(idPlaylist));

            if (existingPlaylist == null)
            {
                return NotFound("Playlist not found");
            }

            // Kiểm tra xem idPlaylist thuộc về người dùng hiện tại
            if (existingPlaylist.IdUser != userId)
            {
                return Unauthorized("You do not have permission to delete this playlist");
            }

            existingPlaylist.Access = access;
            existingPlaylist.NamePlaylist = namePlaylist;
            _context.Playlist.Update(existingPlaylist);
            await _context.SaveChangesAsync();

            var playlists = await _context.Playlist
                .Where(ps => ps.IdUser == userId && ps.Id == int.Parse(idPlaylist)).FirstOrDefaultAsync();
            return Ok(playlists);
        }


        [Authorize]
        [HttpDelete("deletePlaylist")]
        public async Task<ActionResult> DeletePlayList([FromQuery] string idPlaylist)
        {
            var identity = (ClaimsIdentity)User.Identity;
            var idUser = identity.FindFirst("idUser").Value;

            var existingPlaylist = await _context.Playlist.FirstOrDefaultAsync(p => p.Id == int.Parse(idPlaylist));

            if (existingPlaylist == null)
            {
                return NotFound("Playlist not found");
            }

            // Kiểm tra xem idPlaylist thuộc về người dùng hiện tại
            if (existingPlaylist.IdUser != idUser)
            {
                return Unauthorized("You do not have permission to delete this playlist");
            }

            // Nếu điều kiện đều hợp lệ, bạn có thể xóa playlist tại đây
            _context.Playlist.Remove(existingPlaylist);
            await _context.SaveChangesAsync();

            var playlists = await _context.Playlist
                .Where(ps => ps.IdUser == idUser)
                .ToListAsync();
            return Ok(playlists);
        }


        [Authorize]
        [HttpGet("getSongsFromPlaylist")]
        public async Task<ActionResult<IEnumerable<Song>>> GetSongsFromPlaylist([FromQuery] int idPlaylist)
        {

            if (_context.Playlist == null)
            {
                return NotFound();
            }
            var identity = (ClaimsIdentity)User.Identity;
            var idUser = identity.FindFirst("idUser").Value;

            var playlist = await _context.Playlist.FirstOrDefaultAsync(p => p.Id == idPlaylist);

            if (playlist == null)
            {
                return NotFound("Playlist not found");
            }

            if (playlist.IdUser != idUser && playlist.Access != "public")
            {
                return Unauthorized("You do not have permission to access this playlist");
            }
            var playlistData = await _context.Playlist
                .Where(p => p.Id == idPlaylist)
                .Select(p => new
                {
                    p.NamePlaylist,
                    p.Id,
                    p.IdUser,
                    p.Access,
                    Songs = _context.PlaylistSongs
                        .Where(ps => ps.PlaylistId == idPlaylist)
                        .Select(ps => ps.Song)
                        .ToList()
                })
                .FirstOrDefaultAsync();
            return Ok(playlistData);
        }


        [Authorize]
        [HttpPost("postSongPlaylist")]
        public async Task<ActionResult<IEnumerable<Song>>> PostSongPlaylist([FromQuery] string idPlaylist, string idSong)
        {
            var identity = (ClaimsIdentity)User.Identity;
            var userId = identity.FindFirst("idUser").Value;

            var existingPlaylist = await _context.Playlist.FirstOrDefaultAsync(p => p.Id == int.Parse(idPlaylist));

            if (existingPlaylist == null)
            {
                return NotFound("Playlist not found");
            }

            // Kiểm tra xem idPlaylist thuộc về người dùng hiện tại
            if (existingPlaylist.IdUser != userId)
            {
                return Unauthorized("You do not have permission to delete this playlist");
            }
            var existingSong = await _context.Songs.FirstOrDefaultAsync(s => s.Id == int.Parse(idSong));

            if (existingSong == null)
            {
                return NotFound("Song not found");
            }

            var existingSongInPlaylist = await _context.PlaylistSongs
                .FirstOrDefaultAsync(ps => ps.PlaylistId == int.Parse(idPlaylist) && ps.IdSong == int.Parse(idSong));

            if (existingSongInPlaylist != null)
            {
                return Ok("Song already exists in the playlist");
            }

            // Tạo một bản ghi mới trong bảng PlaylistSongs
            var newPlaylistSong = new PlaylistSongs
            {
                PlaylistId = int.Parse(idPlaylist),
                IdSong = int.Parse(idSong)
            };

            _context.PlaylistSongs.Add(newPlaylistSong);
            await _context.SaveChangesAsync();

            var playlistSongs = await _context.PlaylistSongs
                .Where(ps => ps.PlaylistId == int.Parse(idPlaylist))
                .Include(ps => ps.Song)
                .Select(ps => ps.Song)
                .ToListAsync();

            return Ok(playlistSongs);
        }

        [Authorize]
        [HttpDelete("deleteSongPlaylist")]
        public async Task<ActionResult<IEnumerable<Song>>> DeleteSongPlaylist([FromQuery] string idPlaylist, string idSong)
        {
            var identity = (ClaimsIdentity)User.Identity;
            var userId = identity.FindFirst("idUser").Value;

            var existingPlaylist = await _context.Playlist.FirstOrDefaultAsync(p => p.Id == int.Parse(idPlaylist));

            if (existingPlaylist == null)
            {
                return NotFound("Playlist not found");
            }

            // Kiểm tra xem idPlaylist thuộc về người dùng hiện tại
            if (existingPlaylist.IdUser != userId)
            {
                return Unauthorized("You do not have permission to delete this playlist");
            }
            var existingSong = await _context.Songs.FirstOrDefaultAsync(s => s.Id == int.Parse(idSong));

            if (existingSong == null)
            {
                return NotFound("Song not found");
            }

            var playlistSongToDelete = await _context.PlaylistSongs
                .FirstOrDefaultAsync(ps => ps.PlaylistId == int.Parse(idPlaylist) && ps.IdSong == int.Parse(idSong));

            if (playlistSongToDelete == null)
            {
                return NotFound("Song not found in the playlist");
            }

            // Xóa bản ghi PlaylistSongs
            _context.PlaylistSongs.Remove(playlistSongToDelete);
            await _context.SaveChangesAsync();

            var playlistSongs = await _context.PlaylistSongs
                .Where(ps => ps.PlaylistId == int.Parse(idPlaylist))
                .Include(ps => ps.Song)
                .Select(ps => ps.Song)
                .ToListAsync();

            return Ok(playlistSongs);
        }
    }
}
