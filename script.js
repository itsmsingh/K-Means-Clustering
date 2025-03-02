// K-Means Visualization
const beforeCanvas = document.getElementById('beforeCanvas');
const afterCanvas = document.getElementById('afterCanvas');
const beforeCtx = beforeCanvas.getContext('2d');
const afterCtx = afterCanvas.getContext('2d');
const runButton = document.getElementById('runButton');

runButton.addEventListener('click', () => {
  const k = parseInt(document.getElementById('kValue').value);
  const numPoints = parseInt(document.getElementById('dataPoints').value);
  runKMeans(k, numPoints);
});

function runKMeans(k, numPoints) {
  // Clear canvases
  beforeCtx.clearRect(0, 0, beforeCanvas.width, beforeCanvas.height);
  afterCtx.clearRect(0, 0, afterCanvas.width, afterCanvas.height);

  // Generate random data points
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    points.push({
      x: Math.random() * beforeCanvas.width,
      y: Math.random() * beforeCanvas.height,
      cluster: null
    });
  }

  // Draw initial data points on the "Before Clustering" canvas
  points.forEach(point => {
    beforeCtx.fillStyle = '#000';
    beforeCtx.beginPath();
    beforeCtx.arc(point.x, point.y, 3, 0, Math.PI * 2);
    beforeCtx.fill();
  });

  // Initialize centroids randomly
  const centroids = [];
  for (let i = 0; i < k; i++) {
    centroids.push({
      x: Math.random() * afterCanvas.width,
      y: Math.random() * afterCanvas.height
    });
  }

  // K-Means algorithm
  let changed;
  do {
    changed = false;
    // Assign points to nearest centroid
    points.forEach(point => {
      let minDist = Infinity;
      let cluster = null;
      centroids.forEach((centroid, index) => {
        const dist = Math.sqrt((point.x - centroid.x) ** 2 + (point.y - centroid.y) ** 2);
        if (dist < minDist) {
          minDist = dist;
          cluster = index;
        }
      });
      if (point.cluster !== cluster) {
        point.cluster = cluster;
        changed = true;
      }
    });

    // Update centroids
    centroids.forEach((centroid, index) => {
      const clusterPoints = points.filter(point => point.cluster === index);
      if (clusterPoints.length > 0) {
        centroid.x = clusterPoints.reduce((sum, point) => sum + point.x, 0) / clusterPoints.length;
        centroid.y = clusterPoints.reduce((sum, point) => sum + point.y, 0) / clusterPoints.length;
      }
    });
  } while (changed);

  // Draw clustered data points and centroids on the "After Clustering" canvas
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF'];
  points.forEach(point => {
    afterCtx.fillStyle = colors[point.cluster % colors.length];
    afterCtx.beginPath();
    afterCtx.arc(point.x, point.y, 3, 0, Math.PI * 2);
    afterCtx.fill();
  });

  centroids.forEach((centroid, index) => {
    afterCtx.fillStyle = colors[index % colors.length];
    afterCtx.beginPath();
    afterCtx.arc(centroid.x, centroid.y, 5, 0, Math.PI * 2);
    afterCtx.fill();
  });
}

// Quiz Section
const submitQuiz = document.getElementById('submitQuiz');
submitQuiz.addEventListener('click', () => {
  checkAnswer('q1', 'a', 'q1Result');
  checkAnswer('q2', 'a', 'q2Result');
  checkAnswer('q3', 'b', 'q3Result');
});

function checkAnswer(questionName, correctValue, resultId) {
  const selected = document.querySelector(`input[name="${questionName}"]:checked`);
  const result = document.getElementById(resultId);
  if (selected && selected.value === correctValue) {
    result.textContent = '😊';
  } else {
    result.textContent = '😢';
  }
}