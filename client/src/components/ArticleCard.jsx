import React from 'react';
import './ArticleCard.css';

export default function ArticleCard({ article, onBookmark }) {
  const fallbackImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80';

  return (
    <article className="article-card">
      <img
        src={article.urlToImage || fallbackImage}
        alt={article.title}
        className="article-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackImage;
        }}
      />
      <div className="article-body">
        <span className="article-source">{article.sourceName}</span>
        <h3 className="article-title">{article.title}</h3>
        <p className="article-description">
          {article.description
            ? article.description.slice(0, 120) + '...'
            : 'Click read more to view the full story.'}
        </p>
        <div className="article-actions">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="article-link"
          >
            Read Source →
          </a>
          <button
            className="btn-bookmark"
            onClick={() => onBookmark(article)}
          >
            Save
          </button>
        </div>
      </div>
    </article>
  );
}