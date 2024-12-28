'use client';
import { useState } from 'react';
import styles from '../../../styles/signup.module.css';
import { useRouter } from 'next/navigation';

export default function SignUp({ toggleForm }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try{
      const response = await fetch('../api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUsername('');
        setEmail('');
        setPassword('');
        router.push('/auth/login');
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    }
    catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
    finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.body}>
      <div className={styles['main-container']}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h1 className={styles.title}>Sign-Up</h1>
            {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
            <div className={styles['form-group']}>
              <label className={styles.label} htmlFor="username">
                Username
              </label>
              <input
                className={styles.input}
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                minLength={3}
              />
            </div>
            <div className={styles['form-group']}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <input
                className={styles.input}
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className={styles['form-group']}>
              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <input
                className={styles.input}
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>
            <button className={styles.button} type="submit"
            disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
            <p className={styles.switch}>
              Already have an account?{' '}
              <a href="/auth/login" className={styles.switchButton}>
                Login
              </a>
            </p>
          </form>
      </div>
    </div>
  );
}