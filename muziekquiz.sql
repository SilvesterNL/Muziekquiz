-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Gegenereerd op: 05 mrt 2024 om 17:05
-- Serverversie: 10.4.27-MariaDB
-- PHP-versie: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `muziekquiz`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `feedback_bug`
--

CREATE TABLE `feedback_bug` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `feedback_type` enum('Feedback','Bug') NOT NULL,
  `message` text NOT NULL,
  `submitted_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `feedback_bug`
--

INSERT INTO `feedback_bug` (`id`, `name`, `email`, `feedback_type`, `message`, `submitted_at`) VALUES
(1, 'nebi', 'nebi@gmail.com', 'Feedback', 'Ik vind jouw cool.', '2024-03-05 15:39:07'),
(2, 'Nebi', 'nebi@gmail.com', 'Bug', 'hier bug, solly.', '2024-03-05 15:39:21'),
(3, 'Test', 'test@gmail.com', 'Feedback', 'testing123', '2024-03-05 16:48:25'),
(4, 'Test', 'test@gmail.com', 'Feedback', 'testing123', '2024-03-05 16:50:34'),
(5, 'Silvester', 'Silvester@gmail.com', 'Bug', 'Dit is een bug', '2024-03-05 16:51:04'),
(6, 'Silvester1', 'Silvester1@gmail.com', 'Feedback', 'Dit is feedback.', '2024-03-05 16:51:22');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `lobby`
--

CREATE TABLE `lobby` (
  `id` int(11) NOT NULL,
  `randomid` varchar(6) NOT NULL,
  `eigenaar` varchar(255) DEFAULT NULL,
  `cat` varchar(255) DEFAULT NULL,
  `first` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1 = Lobby net gemaakt. 2 = Naam ingevoerd lobby active',
  `active` tinyint(1) NOT NULL DEFAULT 0,
  `antusr` int(1) NOT NULL DEFAULT 1,
  `lastactive` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `music`
--

CREATE TABLE `music` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `artist` varchar(255) NOT NULL,
  `song_path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `music`
--

INSERT INTO `music` (`id`, `title`, `artist`, `song_path`) VALUES
(1, 'Bad Medicine', 'Bon Jovi', 'BadMedicine.mp3'),
(2, 'Blue Monday', 'New Order', 'BlueMonday.mp3'),
(3, 'Boys Dont Cry', 'The Cure', 'BoysDontCry.mp3'),
(4, 'Careless Whisper', 'George Michael', 'CarelessWhisper.mp3'),
(5, 'Everybody Wants To Rule The World', 'Tears For Fears', 'EverybodyWantsToRuleTheWorld.mp3'),
(6, 'Ghostbusters', 'Ray Parker Jr', 'Ghostbusters.mp3'),
(7, 'Its My Life', 'Talk Talk', 'ItsMyLife.mp3'),
(8, 'Jump', 'Van Halen', 'Jump.mp3'),
(9, 'Maneater', 'Daryl Hall & John Oates', 'Maneater.mp3'),
(10, 'Never', 'Heart', 'Never.mp3'),
(11, 'Sweet Dreams', 'Eurythmics', 'SweetDreams.mp3'),
(12, 'Take On Me', 'a-ha', 'TakeOnMe.mp3'),
(13, 'Whats Up', '4 Non Blondes', 'WhatsUp.mp3'),
(14, 'Creep', 'Radiohead', 'Creep.mp3'),
(15, 'Gangstas Paradise', 'Coolio', 'GangstasParadise.mp3');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `music_requests`
--

CREATE TABLE `music_requests` (
  `id` int(11) NOT NULL,
  `youtube_link` varchar(255) NOT NULL,
  `artist_name` varchar(255) NOT NULL,
  `song_title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `music_requests`
--

INSERT INTO `music_requests` (`id`, `youtube_link`, `artist_name`, `song_title`) VALUES
(1, 'https://www.youtube.com/watch?v=UuYXsffev7k', 'Ken Carson', 'MDMA');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `lobbycode` varchar(255) NOT NULL,
  `score` int(20) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `feedback_bug`
--
ALTER TABLE `feedback_bug`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `lobby`
--
ALTER TABLE `lobby`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `music`
--
ALTER TABLE `music`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `music_requests`
--
ALTER TABLE `music_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `feedback_bug`
--
ALTER TABLE `feedback_bug`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT voor een tabel `lobby`
--
ALTER TABLE `lobby`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT voor een tabel `music`
--
ALTER TABLE `music`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT voor een tabel `music_requests`
--
ALTER TABLE `music_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT voor een tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
