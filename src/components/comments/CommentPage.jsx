// src/components/comments/CommentPage.jsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CommentModal from './CommentModal';
import styles from './CommentPage.module.css';

const CommentPage = () => {
  const { id } = useParams(); // product or recipe ID
  const navigate = useNavigate();

  return (
    <div className={styles.commentPageWrapper}>
      <CommentModal recipeId={id} onClose={() => navigate(-1)} />
    </div>
  );
};

export default CommentPage;
