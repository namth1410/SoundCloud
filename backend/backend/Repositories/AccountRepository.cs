using backend.Data;
using backend.Migrations;
using backend.Models;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;



namespace backend.Repositories
{
    public class AccountRepository : ControllerBase, IAccountRepository
    {
        private readonly UserManager<Account> userManager;
        private readonly SignInManager<Account> signInManager;
        private readonly IConfiguration configuration;

        public AccountRepository(UserManager<Account> userManager, SignInManager<Account> signInManager, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.configuration = configuration;
        }

        public async Task<ActionResult<UserProfileModel>> SignInAsync(SignInModel model)
        {
            var result = await signInManager.PasswordSignInAsync(model.Username, model.Password, false, false);

            if (!result.Succeeded)
            {
                return Unauthorized();
            }

            var user = await userManager.FindByNameAsync(model.Username);
            var authClaims = new List<Claim>
            {
                //new Claim(ClaimTypes.Email, model.Username),
                new Claim("username", model.Username),
                new Claim("idUser", user.Id),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, model.Username)
                //new Claim(ClaimTypes.NameIdentifier, userManager.GetUserId(User),
            };

            var authenKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                issuer: configuration["JWT:ValidIssuer"],
                audience: configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddMinutes(200),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authenKey, SecurityAlgorithms.HmacSha512Signature)
            );

            var userProfile = new UserProfileModel
            {
                Username = user.UserName,
                Email = user.Email,
                Name = user.Name,
                Avatar = user.Avatar,
            };

            userProfile.Token = new JwtSecurityTokenHandler().WriteToken(token);

            return userProfile;
        }

        public async Task<IdentityResult> SignUpAsync(SignUpModel model)
        {
            var user = new Account
            {
                Email = model.Username,
                UserName = model.Username,
                Name = model.Name,
            };

            return await userManager.CreateAsync(user, model.Password);
        }

    }
}