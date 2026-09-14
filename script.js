function selectWinner(currentMatchId, winnerName, nextMatchId, positionClass) {
  // Находим следующий матч
  const nextMatch = document.getElementById(nextMatchId);
  if (!nextMatch) {
    // Если это финал
    document.getElementById('champ-box').innerText = "🏆 Победитель: " + winnerName;
    return;
  }

  // Обновляем команду в следующем раунде
  const targetSlot = nextMatch.querySelector('.' + positionClass);
  if (targetSlot) {
    targetSlot.innerText = winnerName;
    targetSlot.classList.remove('placeholder');
    targetSlot.onclick = function() {
      selectWinner(nextMatchId, winnerName, 'null', '');
    };
  }
}
