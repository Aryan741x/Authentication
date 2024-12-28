'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import styles from '../../../styles/login.module.css';
import LoginBannerBgImg from './banner.jpg';

export default function Login() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('../api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email,username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Login successful');
        localStorage.setItem('token', data.token);
        setEmail('');
        setUsername('');
        setPassword('');
        router.push('/dashboard');
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles['main-container']}>
        <Image
          src={LoginBannerBgImg}
          alt="Login Banner"
          className={styles.image}
          priority={false}
        />
        <form className={styles.form} onSubmit={handleSubmit}>
          <h1 className={styles.title}>Login</h1>

          {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}

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

          <button className={styles.button} type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className={styles.switch}>
            Don't have an account?{' '}
            <a href="/auth/signup" className={styles.switchButton}>
              Sign-Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
