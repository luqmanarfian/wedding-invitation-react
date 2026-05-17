import React from 'react';

/**
 * CoupleCard — Individual profile card for bride or groom.
 * Shows photo with hover zoom effect, name, parents, and social links.
 *
 * @param {object} props
 * @param {string} props.name - Full name
 * @param {string} props.photo - Photo URL
 * @param {string} props.role - "Putra dari" or "Putri dari"
 * @param {string} props.parents - Parent names
 * @param {Array<{platform, url, icon}>} props.socials - Social media links
 */
export default function CoupleCard({ name, photo, role, parents, socials }) {
  return (
    <div className="flex-1 flex flex-col items-center">
      {/* Profile photo with hover zoom */}
      <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden mb-6 border-4 border-blush-200 shadow-xl relative group">
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      <h3 className="font-serif text-3xl text-blush-800 font-bold mb-2">{name}</h3>
      <p className="text-text-light mb-4 text-sm">
        {role}
        <br />
        {parents}
      </p>

      {/* Social media links */}
      <div className="flex gap-3 text-blush-400">
        {socials.map((social) => (
          <a
            key={social.platform}
            href={social.url}
            className="hover:text-blush-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className={`${social.icon} text-xl`}></i>
          </a>
        ))}
      </div>
    </div>
  );
}
