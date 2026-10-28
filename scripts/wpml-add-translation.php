<?php
/**
 * 블로그 글/페이지의 WPML 번역본을 만들거나 갱신한다 (Claude 번역 → WP 등록용).
 * 서버에서: wp eval-file wpml-add-translation.php <원본ID> <언어코드> <JSON파일> --user=usepic_admin
 *   언어코드: WPML 내부 코드 (en, ja, zh-hans, zh-hant, id, th, ru)
 *   JSON: {"title": "...", "content": "...", "excerpt": "...", "slug": "..."}  (slug 생략 시 원본 slug)
 * 원본의 카테고리·태그는 해당 언어 번역 용어로, 대표 이미지는 그대로 연결한다.
 */
global $sitepress;

[ $source_id, $lang, $json_file ] = array_map( 'trim', $args );
$source_id = (int) $source_id;
$source    = get_post( $source_id );
$data      = json_decode( file_get_contents( $json_file ), true );
if ( ! $source || ! is_array( $data ) || empty( $data['title'] ) ) {
	WP_CLI::error( '원본 글 또는 JSON(title 필수)을 확인하세요.' );
}

$type    = 'post_' . $source->post_type;
$details = apply_filters( 'wpml_element_language_details', null, [ 'element_id' => $source_id, 'element_type' => $source->post_type ] );
$slug    = $data['slug'] ?? $source->post_name;

$sitepress->switch_lang( $lang );
$existing = apply_filters( 'wpml_object_id', $source_id, $source->post_type, false, $lang );
$postarr  = [
	'post_type'    => $source->post_type,
	'post_status'  => $source->post_status,
	'post_title'   => $data['title'],
	'post_content' => $data['content'] ?? '',
	'post_excerpt' => $data['excerpt'] ?? '',
	'post_author'  => $source->post_author,
	'post_date'    => $source->post_date,
];

if ( $existing && $existing !== $source_id ) {
	$id = wp_update_post( [ 'ID' => $existing ] + $postarr, true );
} else {
	$id = wp_insert_post( $postarr, true );
	if ( ! is_wp_error( $id ) ) {
		do_action( 'wpml_set_element_language_details', [
			'element_id'           => $id,
			'element_type'         => $type,
			'trid'                 => $details->trid,
			'language_code'        => $lang,
			'source_language_code' => $details->language_code,
		] );
	}
}
if ( is_wp_error( $id ) ) {
	WP_CLI::error( $id->get_error_message() );
}

// 언어가 지정된 뒤에 slug를 넣어야 WPML이 언어별 동일 slug를 허용한다
wp_update_post( [ 'ID' => $id, 'post_name' => $slug ] );

foreach ( get_object_taxonomies( $source->post_type ) as $tax ) {
	if ( ! is_taxonomy_translated( $tax ) ) {
		continue;
	}
	$term_ids = [];
	foreach ( wp_get_object_terms( $source_id, $tax, [ 'fields' => 'ids' ] ) as $term_id ) {
		$tr = apply_filters( 'wpml_object_id', $term_id, $tax, false, $lang );
		if ( $tr ) {
			$term_ids[] = (int) $tr;
		}
	}
	if ( $term_ids ) {
		wp_set_object_terms( $id, $term_ids, $tax );
	}
}

$thumb = get_post_thumbnail_id( $source_id );
if ( $thumb ) {
	set_post_thumbnail( $id, $thumb );
}

$sitepress->switch_lang( $lang );
WP_CLI::success( "{$lang} #{$id} " . get_permalink( $id ) );
