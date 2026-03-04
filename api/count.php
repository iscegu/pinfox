<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$dataFile = __DIR__ . '/../data/counts.json';

/* Dosya yoksa başlat */
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([
        'tools'  => [],
        'games'  => [],
        'social' => []
    ], JSON_PRETTY_PRINT));
}

$data = json_decode(file_get_contents($dataFile), true);
if (!isset($data['social'])) $data['social'] = [];

$action = $_GET['action'] ?? 'get';   // get | hit
$type   = $_GET['type']   ?? '';      // tool | game | social
$id     = $_GET['id']     ?? '';      // kdv-hesaplayici, racire vb.

/* HIT: sayacı artır */
if ($action === 'hit' && $id && in_array($type, ['tool', 'game', 'social'])) {
    $key = $type . 's';   // tool→tools, game→games, social→social
    if ($type === 'social') $key = 'social';
    if (!isset($data[$key][$id])) $data[$key][$id] = 0;
    $data[$key][$id]++;

    $fp = fopen($dataFile, 'c+');
    flock($fp, LOCK_EX);
    ftruncate($fp, 0);
    fwrite($fp, json_encode($data, JSON_PRETTY_PRINT));
    flock($fp, LOCK_UN);
    fclose($fp);
}

/* GET: veri döndür */
echo json_encode([
    'tools'  => $data['tools']  ?? [],
    'games'  => $data['games']  ?? [],
    'social' => $data['social'] ?? []
]);