<?php
/*
 * wp-config.php 의 "That's all, stop editing!" 줄 위에 붙여 넣는다.
 * Worker(usepic-blog-proxy)를 거친 요청이면 공개 도메인 usepic.net 으로 인식시킨다.
 * USEPIC_PROXY_SECRET 은 Worker 의 PROXY_SECRET 과 같은 값으로 바꾼다.
 */
define('USEPIC_PROXY_SECRET', 'CHANGE-ME');

if (isset($_SERVER['HTTP_X_USEPIC_PROXY']) && hash_equals(USEPIC_PROXY_SECRET, $_SERVER['HTTP_X_USEPIC_PROXY'])) {
    $_SERVER['HTTP_HOST'] = 'usepic.net';
    $_SERVER['HTTPS'] = 'on';
}

define('WP_HOME', 'https://usepic.net/blog');
define('WP_SITEURL', 'https://usepic.net/blog');
