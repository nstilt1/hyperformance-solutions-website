/*!
 * Kaleidomo Core
 * Copyright (c) 2022-2026 Hyperformance Solutions. All rights reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * 
 * This software, including its source code, compiled WebAssembly binaries
 * (e.g. kaleidomo_core_bg.wasm), JavaScript bindings, shaders, and any
 * derivative works (collectively, the "Software"), is the exclusive property
 * of Hyperformance Solutions.
 * 
 * The Software is made available solely for use through websites and
 * applications operated by Hyperformance Solutions. No license or right is
 * granted to any person to copy, download for reuse, host, redistribute,
 * sublicense, modify, decompile, disassemble, reverse engineer, or embed the
 * Software in any other website, application, or service, in whole or in
 * part, without prior written permission from Hyperformance Solutions.
 * 
 * Unauthorized use, reproduction, or distribution of the Software is strictly
 * prohibited and may result in civil and criminal penalties, and will be
 * prosecuted to the maximum extent possible under the law, including through
 * takedown notices under the Digital Millennium Copyright Act (DMCA).
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED. IN NO EVENT SHALL HYPERFORMANCE SOLUTIONS BE LIABLE FOR ANY CLAIM,
 * DAMAGES, OR OTHER LIABILITY ARISING FROM THE USE OF THE SOFTWARE.
 * 
 * For licensing inquiries, contact Hyperformance Solutions.
 */
/* @ts-self-types="./kaleidomo_core.d.ts" */

export class LiveKaleidoscopeEngine {
    static __wrap(ptr) {
        const obj = Object.create(LiveKaleidoscopeEngine.prototype);
        obj.__wbg_ptr = ptr;
        LiveKaleidoscopeEngineFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LiveKaleidoscopeEngineFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_livekaleidoscopeengine_free(ptr, 0);
    }
    /**
     * Clear the audio peak buffer and reset smoothing state.
     */
    clear_audio_peaks() {
        wasm.livekaleidoscopeengine_clear_audio_peaks(this.__wbg_ptr);
    }
    /**
     * Convenience: fetch an image URL with `fetch`, decode it, upload to GPU.
     * Returns a Promise<void> — await it in TypeScript before calling start_animation.
     * @param {string} url
     * @returns {Promise<void>}
     */
    load_image_from_url(url) {
        const ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.livekaleidoscopeengine_load_image_from_url(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Load raw RGBA pixel bytes into the GPU source texture.
     * Call this before `start_animation`.
     * @param {Uint8Array} rgba_bytes
     * @param {number} width
     * @param {number} height
     */
    load_source_image(rgba_bytes, width, height) {
        const ptr0 = passArray8ToWasm0(rgba_bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.livekaleidoscopeengine_load_source_image(this.__wbg_ptr, ptr0, len0, width, height);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Creates a persistent GPU rendering context bound to an HTMLCanvasElement
     * on the main thread or an OffscreenCanvas in a dedicated worker.
     * @param {any} canvas
     */
    constructor(canvas) {
        const ret = wasm.livekaleidoscopeengine_new(canvas);
        return ret;
    }
    /**
     * @param {number} count
     * @param {number} offset_x
     * @param {number} offset_y
     * @param {number} zoom
     * @param {number} tile_count
     * @param {number} triangle_center_x
     * @param {number} triangle_center_y
     * @param {number} triangle_rotation_rad
     * @param {number} kaleido_type_idx
     * @param {number} hue_rotation
     * @param {boolean} recolor_enabled
     * @param {string} recolor_seed
     * @param {number} recolor_mode
     * @param {number} recolor_threshold
     * @param {number} recolor_cell_size
     * @param {WasmVideoSettings} video_settings
     * @param {number} frame
     * @param {number} anti_alias
     * @param {boolean} derivative_mipmapping
     * @param {number} anisotropy_level
     * @param {number} super_sample
     * @param {boolean} aspect_correct
     */
    render_frame(count, offset_x, offset_y, zoom, tile_count, triangle_center_x, triangle_center_y, triangle_rotation_rad, kaleido_type_idx, hue_rotation, recolor_enabled, recolor_seed, recolor_mode, recolor_threshold, recolor_cell_size, video_settings, frame, anti_alias, derivative_mipmapping, anisotropy_level, super_sample, aspect_correct) {
        const ptr0 = passStringToWasm0(recolor_seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(video_settings, WasmVideoSettings);
        const ret = wasm.livekaleidoscopeengine_render_frame(this.__wbg_ptr, count, offset_x, offset_y, zoom, tile_count, triangle_center_x, triangle_center_y, triangle_rotation_rad, kaleido_type_idx, hue_rotation, recolor_enabled, ptr0, len0, recolor_mode, recolor_threshold, recolor_cell_size, video_settings.__wbg_ptr, frame, anti_alias, derivative_mipmapping, anisotropy_level, super_sample, aspect_correct);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Renders only the `canvas_width`×`canvas_height` window whose top-left
     * corner is (`x`, `y`) inside a virtual `full_width`×`full_height` image.
     * Every pixel is computed in full-image coordinates, so stitching windows
     * reproduces the tiled export exactly. Unlike `set_export_region`, the
     * region applies to this call only; the previous region is restored.
     * Remaining arguments match `render_frame`.
     * @param {number} full_width
     * @param {number} full_height
     * @param {number} x
     * @param {number} y
     * @param {number} count
     * @param {number} offset_x
     * @param {number} offset_y
     * @param {number} zoom
     * @param {number} tile_count
     * @param {number} triangle_center_x
     * @param {number} triangle_center_y
     * @param {number} triangle_rotation_rad
     * @param {number} kaleido_type_idx
     * @param {number} hue_rotation
     * @param {boolean} recolor_enabled
     * @param {string} recolor_seed
     * @param {number} recolor_mode
     * @param {number} recolor_threshold
     * @param {number} recolor_cell_size
     * @param {WasmVideoSettings} video_settings
     * @param {number} frame
     * @param {number} anti_alias
     * @param {boolean} derivative_mipmapping
     * @param {number} anisotropy_level
     * @param {number} super_sample
     * @param {boolean} aspect_correct
     */
    render_frame_region(full_width, full_height, x, y, count, offset_x, offset_y, zoom, tile_count, triangle_center_x, triangle_center_y, triangle_rotation_rad, kaleido_type_idx, hue_rotation, recolor_enabled, recolor_seed, recolor_mode, recolor_threshold, recolor_cell_size, video_settings, frame, anti_alias, derivative_mipmapping, anisotropy_level, super_sample, aspect_correct) {
        const ptr0 = passStringToWasm0(recolor_seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(video_settings, WasmVideoSettings);
        const ret = wasm.livekaleidoscopeengine_render_frame_region(this.__wbg_ptr, full_width, full_height, x, y, count, offset_x, offset_y, zoom, tile_count, triangle_center_x, triangle_center_y, triangle_rotation_rad, kaleido_type_idx, hue_rotation, recolor_enabled, ptr0, len0, recolor_mode, recolor_threshold, recolor_cell_size, video_settings.__wbg_ptr, frame, anti_alias, derivative_mipmapping, anisotropy_level, super_sample, aspect_correct);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Resize the transferred canvas and reconfigure its WebGPU surface.
     * @param {number} width
     * @param {number} height
     */
    resize(width, height) {
        const ret = wasm.livekaleidoscopeengine_resize(this.__wbg_ptr, width, height);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Experimental fractal-lab variant. The first 52 values are identical to
     * `set_pod_details`; the final vec4 carries live-animation configuration.
     * @param {Float32Array} values
     */
    set_animated_pod_details(values) {
        const ret = wasm.livekaleidoscopeengine_set_animated_pod_details(this.__wbg_ptr, values);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Set normalized audio peaks (one f32 per video frame, values 0.0–1.0).
     * Call this after decoding and normalizing audio in TypeScript.
     * @param {Float32Array} peaks
     */
    set_audio_peaks(peaks) {
        wasm.livekaleidoscopeengine_set_audio_peaks(this.__wbg_ptr, peaks);
    }
    /**
     * Set global dimensions and this tile's origin without allocating a
     * full-size GPU texture. Call after resizing the small export canvas.
     * @param {number} full_width
     * @param {number} full_height
     * @param {number} x
     * @param {number} y
     */
    set_export_region(full_width, full_height, x, y) {
        const ret = wasm.livekaleidoscopeengine_set_export_region(this.__wbg_ptr, full_width, full_height, x, y);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Sets the UTF-8 seed material used when POD boundary noise selects the
     * ChaCha8 string-seed mode. The GPU backend hashes it with SHA-256.
     * @param {string} seed
     */
    set_pod_boundary_string_seed(seed) {
        const ptr0 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.livekaleidoscopeengine_set_pod_boundary_string_seed(this.__wbg_ptr, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * * `anti_alias` — bilinear texture filtering instead of nearest-neighbor. Default: `false`.
     * * `super_sample` — internal supersampling factor, `1`-`4` (`1` disables it). Default: `1`.
     * * `aspect_correct` — corrects stretching on non-square canvases. Default: `false`.
     * Render one deterministic still frame. Exporters use this instead of
     * racing the requestAnimationFrame preview loop before canvas capture.
     * Sets POD-only detail uniforms without changing the long-standing
     * render_frame API. Missing values and non-finite values become zero,
     * which is the shader's visually neutral configuration.
     * @param {Float32Array} values
     */
    set_pod_details(values) {
        const ret = wasm.livekaleidoscopeengine_set_pod_details(this.__wbg_ptr, values);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Begin the rAF loop.
     *
     * * `base_settings_js` — a JS object matching `KaleidoSettings` (count, offset_x/y, zoom,
     *   tile_count, triangle_center_x/y, triangle_rotation_rad, kaleido_type_idx, hue_rotation)
     * * `video_settings` — a `WasmVideoSettings` instance
     * * `anti_alias` — enables bilinear texture filtering when sampling the source image
     *   instead of nearest-neighbor. Default/disabled value: `false`.
     * * `super_sample` — internal supersampling factor (`1` = disabled/native resolution,
     *   `2`-`4` render larger internally and box-downsample). Default/disabled value: `1`.
     * * `aspect_correct` — corrects the kaleidoscope pattern so it isn't visually stretched
     *   into an ellipse when the canvas is non-square. Default/disabled value: `false`.
     * @param {number} count
     * @param {number} offset_x
     * @param {number} offset_y
     * @param {number} zoom
     * @param {number} tile_count
     * @param {number} triangle_center_x
     * @param {number} triangle_center_y
     * @param {number} triangle_rotation_rad
     * @param {number} kaleido_type_idx
     * @param {number} hue_rotation
     * @param {boolean} recolor_enabled
     * @param {string} recolor_seed
     * @param {number} recolor_mode
     * @param {number} recolor_threshold
     * @param {number} recolor_cell_size
     * @param {WasmVideoSettings} video_settings
     * @param {number} anti_alias
     * @param {boolean} derivative_mipmapping
     * @param {number} anisotropy_level
     * @param {number} super_sample
     * @param {boolean} aspect_correct
     */
    start_animation(count, offset_x, offset_y, zoom, tile_count, triangle_center_x, triangle_center_y, triangle_rotation_rad, kaleido_type_idx, hue_rotation, recolor_enabled, recolor_seed, recolor_mode, recolor_threshold, recolor_cell_size, video_settings, anti_alias, derivative_mipmapping, anisotropy_level, super_sample, aspect_correct) {
        const ptr0 = passStringToWasm0(recolor_seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(video_settings, WasmVideoSettings);
        const ret = wasm.livekaleidoscopeengine_start_animation(this.__wbg_ptr, count, offset_x, offset_y, zoom, tile_count, triangle_center_x, triangle_center_y, triangle_rotation_rad, kaleido_type_idx, hue_rotation, recolor_enabled, ptr0, len0, recolor_mode, recolor_threshold, recolor_cell_size, video_settings.__wbg_ptr, anti_alias, derivative_mipmapping, anisotropy_level, super_sample, aspect_correct);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Cancel the animation loop (idempotent).
     */
    stop_animation() {
        wasm.livekaleidoscopeengine_stop_animation(this.__wbg_ptr);
    }
    /**
     * * `anti_alias` — bilinear texture filtering instead of nearest-neighbor. Default: `false`.
     * * `super_sample` — internal supersampling factor, `1`-`4` (`1` disables it). Default: `1`.
     * * `aspect_correct` — corrects stretching on non-square canvases. Default: `false`.
     * @param {number} count
     * @param {number} offset_x
     * @param {number} offset_y
     * @param {number} zoom
     * @param {number} tile_count
     * @param {number} triangle_center_x
     * @param {number} triangle_center_y
     * @param {number} triangle_rotation_rad
     * @param {number} kaleido_type_idx
     * @param {number} hue_rotation
     * @param {boolean} recolor_enabled
     * @param {string} recolor_seed
     * @param {number} recolor_mode
     * @param {number} recolor_threshold
     * @param {number} recolor_cell_size
     * @param {WasmVideoSettings} video_settings
     * @param {number} anti_alias
     * @param {boolean} derivative_mipmapping
     * @param {number} anisotropy_level
     * @param {number} super_sample
     * @param {boolean} aspect_correct
     */
    update_animation_settings(count, offset_x, offset_y, zoom, tile_count, triangle_center_x, triangle_center_y, triangle_rotation_rad, kaleido_type_idx, hue_rotation, recolor_enabled, recolor_seed, recolor_mode, recolor_threshold, recolor_cell_size, video_settings, anti_alias, derivative_mipmapping, anisotropy_level, super_sample, aspect_correct) {
        const ptr0 = passStringToWasm0(recolor_seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(video_settings, WasmVideoSettings);
        const ret = wasm.livekaleidoscopeengine_update_animation_settings(this.__wbg_ptr, count, offset_x, offset_y, zoom, tile_count, triangle_center_x, triangle_center_y, triangle_rotation_rad, kaleido_type_idx, hue_rotation, recolor_enabled, ptr0, len0, recolor_mode, recolor_threshold, recolor_cell_size, video_settings.__wbg_ptr, anti_alias, derivative_mipmapping, anisotropy_level, super_sample, aspect_correct);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
}
if (Symbol.dispose) LiveKaleidoscopeEngine.prototype[Symbol.dispose] = LiveKaleidoscopeEngine.prototype.free;

/**
 * Animation parameters passed from TypeScript. All fields are public so
 * they can be set directly from JS via a plain object converted with
 * `serde-wasm-bindgen`, or built field-by-field.
 */
export class WasmVideoSettings {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmVideoSettingsFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmvideosettings_free(ptr, 0);
    }
    /**
     * Total loop duration in seconds (e.g. 10.0)
     * @returns {number}
     */
    get animation_duration() {
        const ret = wasm.__wbg_get_wasmvideosettings_animation_duration(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get audio_orientation_amount() {
        const ret = wasm.__wbg_get_wasmvideosettings_audio_orientation_amount(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get audio_peak_smoothing() {
        const ret = wasm.__wbg_get_wasmvideosettings_audio_peak_smoothing(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {boolean}
     */
    get audio_reactive_enabled() {
        const ret = wasm.__wbg_get_wasmvideosettings_audio_reactive_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    get audio_reorientation_amount() {
        const ret = wasm.__wbg_get_wasmvideosettings_audio_reorientation_amount(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get fps() {
        const ret = wasm.__wbg_get_wasmvideosettings_fps(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get hero_circle_left_x() {
        const ret = wasm.__wbg_get_wasmvideosettings_hero_circle_left_x(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get hero_circle_right_x() {
        const ret = wasm.__wbg_get_wasmvideosettings_hero_circle_right_x(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get hero_circle_y() {
        const ret = wasm.__wbg_get_wasmvideosettings_hero_circle_y(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get hero_desired_left_rotation() {
        const ret = wasm.__wbg_get_wasmvideosettings_hero_desired_left_rotation(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get hue_cycles() {
        const ret = wasm.__wbg_get_wasmvideosettings_hue_cycles(this.__wbg_ptr);
        return ret;
    }
    /**
     * Hue sweep range in degrees (e.g. 60)
     * @returns {number}
     */
    get hue_range() {
        const ret = wasm.__wbg_get_wasmvideosettings_hue_range(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get hue_start_offset() {
        const ret = wasm.__wbg_get_wasmvideosettings_hue_start_offset(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get num_zoom_loops() {
        const ret = wasm.__wbg_get_wasmvideosettings_num_zoom_loops(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Independent orientation cycles per second (base reorientation speed, no audio)
     * @returns {number}
     */
    get orientation_base_speed() {
        const ret = wasm.__wbg_get_wasmvideosettings_orientation_base_speed(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get orientation_cycles() {
        const ret = wasm.__wbg_get_wasmvideosettings_orientation_cycles(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get orientation_duration() {
        const ret = wasm.__wbg_get_wasmvideosettings_orientation_duration(this.__wbg_ptr);
        return ret;
    }
    /**
     * Multiplier applied to the smoothed audio peak for orientation + rotation kick
     * @returns {number}
     */
    get orientation_peak_multiplier() {
        const ret = wasm.__wbg_get_wasmvideosettings_orientation_peak_multiplier(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get orientation_range() {
        const ret = wasm.__wbg_get_wasmvideosettings_orientation_range(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get orientation_start_offset() {
        const ret = wasm.__wbg_get_wasmvideosettings_orientation_start_offset(this.__wbg_ptr);
        return ret;
    }
    /**
     * Modulation depth from 0 (full radius) to 1 (center-to-full-radius).
     * @returns {number}
     */
    get radius_depth() {
        const ret = wasm.__wbg_get_wasmvideosettings_radius_depth(this.__wbg_ptr);
        return ret;
    }
    /**
     * Radius modulation period in seconds. Non-positive disables it.
     * @returns {number}
     */
    get radius_duration() {
        const ret = wasm.__wbg_get_wasmvideosettings_radius_duration(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get rotation_cycles() {
        const ret = wasm.__wbg_get_wasmvideosettings_rotation_cycles(this.__wbg_ptr);
        return ret;
    }
    /**
     * How many radians to sweep across the rotation range per loop
     * @returns {number}
     */
    get rotation_range() {
        const ret = wasm.__wbg_get_wasmvideosettings_rotation_range(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get rotation_start_offset() {
        const ret = wasm.__wbg_get_wasmvideosettings_rotation_start_offset(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get zoom_max() {
        const ret = wasm.__wbg_get_wasmvideosettings_zoom_max(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get zoom_min() {
        const ret = wasm.__wbg_get_wasmvideosettings_zoom_min(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get zoom_start_offset() {
        const ret = wasm.__wbg_get_wasmvideosettings_zoom_start_offset(this.__wbg_ptr);
        return ret;
    }
    /**
     * Total loop duration in seconds (e.g. 10.0)
     * @param {number} arg0
     */
    set animation_duration(arg0) {
        wasm.__wbg_set_wasmvideosettings_animation_duration(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set audio_orientation_amount(arg0) {
        wasm.__wbg_set_wasmvideosettings_audio_orientation_amount(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set audio_peak_smoothing(arg0) {
        wasm.__wbg_set_wasmvideosettings_audio_peak_smoothing(this.__wbg_ptr, arg0);
    }
    /**
     * @param {boolean} arg0
     */
    set audio_reactive_enabled(arg0) {
        wasm.__wbg_set_wasmvideosettings_audio_reactive_enabled(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set audio_reorientation_amount(arg0) {
        wasm.__wbg_set_wasmvideosettings_audio_reorientation_amount(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set fps(arg0) {
        wasm.__wbg_set_wasmvideosettings_fps(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set hero_circle_left_x(arg0) {
        wasm.__wbg_set_wasmvideosettings_hero_circle_left_x(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set hero_circle_right_x(arg0) {
        wasm.__wbg_set_wasmvideosettings_hero_circle_right_x(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set hero_circle_y(arg0) {
        wasm.__wbg_set_wasmvideosettings_hero_circle_y(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set hero_desired_left_rotation(arg0) {
        wasm.__wbg_set_wasmvideosettings_hero_desired_left_rotation(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set hue_cycles(arg0) {
        wasm.__wbg_set_wasmvideosettings_hue_cycles(this.__wbg_ptr, arg0);
    }
    /**
     * Hue sweep range in degrees (e.g. 60)
     * @param {number} arg0
     */
    set hue_range(arg0) {
        wasm.__wbg_set_wasmvideosettings_hue_range(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set hue_start_offset(arg0) {
        wasm.__wbg_set_wasmvideosettings_hue_start_offset(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set num_zoom_loops(arg0) {
        wasm.__wbg_set_wasmvideosettings_num_zoom_loops(this.__wbg_ptr, arg0);
    }
    /**
     * Independent orientation cycles per second (base reorientation speed, no audio)
     * @param {number} arg0
     */
    set orientation_base_speed(arg0) {
        wasm.__wbg_set_wasmvideosettings_orientation_base_speed(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set orientation_cycles(arg0) {
        wasm.__wbg_set_wasmvideosettings_orientation_cycles(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set orientation_duration(arg0) {
        wasm.__wbg_set_wasmvideosettings_orientation_duration(this.__wbg_ptr, arg0);
    }
    /**
     * Multiplier applied to the smoothed audio peak for orientation + rotation kick
     * @param {number} arg0
     */
    set orientation_peak_multiplier(arg0) {
        wasm.__wbg_set_wasmvideosettings_orientation_peak_multiplier(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set orientation_range(arg0) {
        wasm.__wbg_set_wasmvideosettings_orientation_range(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set orientation_start_offset(arg0) {
        wasm.__wbg_set_wasmvideosettings_orientation_start_offset(this.__wbg_ptr, arg0);
    }
    /**
     * Modulation depth from 0 (full radius) to 1 (center-to-full-radius).
     * @param {number} arg0
     */
    set radius_depth(arg0) {
        wasm.__wbg_set_wasmvideosettings_radius_depth(this.__wbg_ptr, arg0);
    }
    /**
     * Radius modulation period in seconds. Non-positive disables it.
     * @param {number} arg0
     */
    set radius_duration(arg0) {
        wasm.__wbg_set_wasmvideosettings_radius_duration(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set rotation_cycles(arg0) {
        wasm.__wbg_set_wasmvideosettings_rotation_cycles(this.__wbg_ptr, arg0);
    }
    /**
     * How many radians to sweep across the rotation range per loop
     * @param {number} arg0
     */
    set rotation_range(arg0) {
        wasm.__wbg_set_wasmvideosettings_rotation_range(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set rotation_start_offset(arg0) {
        wasm.__wbg_set_wasmvideosettings_rotation_start_offset(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set zoom_max(arg0) {
        wasm.__wbg_set_wasmvideosettings_zoom_max(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set zoom_min(arg0) {
        wasm.__wbg_set_wasmvideosettings_zoom_min(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set zoom_start_offset(arg0) {
        wasm.__wbg_set_wasmvideosettings_zoom_start_offset(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {string}
     */
    get_hue_fn() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.wasmvideosettings_get_hue_fn(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get_orientation_fn() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.wasmvideosettings_get_orientation_fn(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get_radius_fn() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.wasmvideosettings_get_radius_fn(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get_rotation_fn() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.wasmvideosettings_get_rotation_fn(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get_zoom_fn() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.wasmvideosettings_get_zoom_fn(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    constructor() {
        const ret = wasm.wasmvideosettings_new();
        this.__wbg_ptr = ret;
        WasmVideoSettingsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string} f
     */
    set_hue_fn(f) {
        const ptr0 = passStringToWasm0(f, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.wasmvideosettings_set_hue_fn(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} f
     */
    set_orientation_fn(f) {
        const ptr0 = passStringToWasm0(f, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.wasmvideosettings_set_orientation_fn(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} f
     */
    set_radius_fn(f) {
        const ptr0 = passStringToWasm0(f, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.wasmvideosettings_set_radius_fn(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} f
     */
    set_rotation_fn(f) {
        const ptr0 = passStringToWasm0(f, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.wasmvideosettings_set_rotation_fn(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} f
     */
    set_zoom_fn(f) {
        const ptr0 = passStringToWasm0(f, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.wasmvideosettings_set_zoom_fn(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) WasmVideoSettings.prototype[Symbol.dispose] = WasmVideoSettings.prototype.free;

/**
 * Returns the Kaleidomo Core license text.
 * @returns {string}
 */
export function license() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.license();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Logs the Kaleidomo Core license text to the browser console.
 */
export function logLicense() {
    wasm.logLicense();
}
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg_Window_a07901001eb4269f: function(arg0) {
            const ret = arg0.Window;
            return ret;
        },
        __wbg_WorkerGlobalScope_d1b9459d53a39f3d: function(arg0) {
            const ret = arg0.WorkerGlobalScope;
            return ret;
        },
        __wbg___wbindgen_debug_string_0accd80f45e5faa2: function(arg0, arg1) {
            const ret = debugString(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_is_function_754e9f305ff6029e: function(arg0) {
            const ret = typeof(arg0) === 'function';
            return ret;
        },
        __wbg___wbindgen_is_null_87c3bfe968c6a5ad: function(arg0) {
            const ret = arg0 === null;
            return ret;
        },
        __wbg___wbindgen_is_undefined_67b456be8673d3d7: function(arg0) {
            const ret = arg0 === undefined;
            return ret;
        },
        __wbg___wbindgen_string_get_72bdf95d3ae505b1: function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_throw_1506f2235d1bdba0: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg__wbg_cb_unref_61db23ac97f16c31: function(arg0) {
            arg0._wbg_cb_unref();
        },
        __wbg_arrayBuffer_05927079aabe6d46: function() { return handleError(function (arg0) {
            const ret = arg0.arrayBuffer();
            return ret;
        }, arguments); },
        __wbg_beginComputePass_705eb14eefc2b94e: function(arg0, arg1) {
            const ret = arg0.beginComputePass(arg1);
            return ret;
        },
        __wbg_beginRenderPass_10e1d8bb36f2f74e: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.beginRenderPass(arg1);
            return ret;
        }, arguments); },
        __wbg_call_9c758de292015997: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.call(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_cancelAnimationFrame_d77d82aadb81abda: function() { return handleError(function (arg0, arg1) {
            arg0.cancelAnimationFrame(arg1);
        }, arguments); },
        __wbg_cancelAnimationFrame_fd3abe3611601214: function() { return handleError(function (arg0, arg1) {
            arg0.cancelAnimationFrame(arg1);
        }, arguments); },
        __wbg_configure_3d64c677c7d68a15: function() { return handleError(function (arg0, arg1) {
            arg0.configure(arg1);
        }, arguments); },
        __wbg_createBindGroupLayout_9ea1a44942aaf13e: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.createBindGroupLayout(arg1);
            return ret;
        }, arguments); },
        __wbg_createBindGroup_2320df4db188406c: function(arg0, arg1) {
            const ret = arg0.createBindGroup(arg1);
            return ret;
        },
        __wbg_createBuffer_2f08c0205e04efca: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.createBuffer(arg1);
            return ret;
        }, arguments); },
        __wbg_createCommandEncoder_cd88faca35d9ed68: function(arg0, arg1) {
            const ret = arg0.createCommandEncoder(arg1);
            return ret;
        },
        __wbg_createComputePipeline_3e135ff73c8fc483: function(arg0, arg1) {
            const ret = arg0.createComputePipeline(arg1);
            return ret;
        },
        __wbg_createPipelineLayout_7a186f2e9bf0d605: function(arg0, arg1) {
            const ret = arg0.createPipelineLayout(arg1);
            return ret;
        },
        __wbg_createRenderPipeline_f48187ba9f7701e8: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.createRenderPipeline(arg1);
            return ret;
        }, arguments); },
        __wbg_createSampler_248bd67c920af37d: function(arg0, arg1) {
            const ret = arg0.createSampler(arg1);
            return ret;
        },
        __wbg_createShaderModule_53701de4fb271c90: function(arg0, arg1) {
            const ret = arg0.createShaderModule(arg1);
            return ret;
        },
        __wbg_createTexture_9e76b80a2dc0d12e: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.createTexture(arg1);
            return ret;
        }, arguments); },
        __wbg_createView_cc96b5bdd3d5bf5e: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.createView(arg1);
            return ret;
        }, arguments); },
        __wbg_debug_6d96d354ecb8cdb3: function(arg0, arg1, arg2, arg3) {
            console.debug(arg0, arg1, arg2, arg3);
        },
        __wbg_description_18d0a6d4077fec8e: function(arg0, arg1) {
            const ret = arg1.description;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_dispatchWorkgroups_0cf298d736b85a78: function(arg0, arg1, arg2, arg3) {
            arg0.dispatchWorkgroups(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0);
        },
        __wbg_document_aceb08cd6489baf5: function(arg0) {
            const ret = arg0.document;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_draw_ad0811de56a2d768: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.draw(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
        },
        __wbg_end_414453a89205612c: function(arg0) {
            arg0.end();
        },
        __wbg_end_fb560a3ae8e3624e: function(arg0) {
            arg0.end();
        },
        __wbg_error_78ff5b3a29b770e0: function(arg0) {
            console.error(arg0);
        },
        __wbg_error_9ad1450feb5d541d: function(arg0, arg1, arg2, arg3) {
            console.error(arg0, arg1, arg2, arg3);
        },
        __wbg_error_a6fa202b58aa1cd3: function(arg0, arg1) {
            let deferred0_0;
            let deferred0_1;
            try {
                deferred0_0 = arg0;
                deferred0_1 = arg1;
                console.error(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
            }
        },
        __wbg_fetch_8420348c88fa7037: function(arg0, arg1, arg2) {
            const ret = arg0.fetch(getStringFromWasm0(arg1, arg2));
            return ret;
        },
        __wbg_fetch_eeb935cedae1e1bd: function(arg0, arg1, arg2) {
            const ret = arg0.fetch(getStringFromWasm0(arg1, arg2));
            return ret;
        },
        __wbg_finish_087cb89c65c06eb1: function(arg0) {
            const ret = arg0.finish();
            return ret;
        },
        __wbg_finish_cfaeede3baf55be1: function(arg0, arg1) {
            const ret = arg0.finish(arg1);
            return ret;
        },
        __wbg_getContext_469d34698d869fc1: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments); },
        __wbg_getContext_7d3a8f461c828713: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments); },
        __wbg_getCurrentTexture_51975ae7185fd15f: function() { return handleError(function (arg0) {
            const ret = arg0.getCurrentTexture();
            return ret;
        }, arguments); },
        __wbg_getPreferredCanvasFormat_1b8495aeb1d11ab1: function(arg0) {
            const ret = arg0.getPreferredCanvasFormat();
            return (__wbindgen_enum_GpuTextureFormat.indexOf(ret) + 1 || 96) - 1;
        },
        __wbg_get_cb935c1402921898: function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_get_index_ae03aafc4236a066: function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return ret;
        },
        __wbg_gpu_a7c12045c25d009a: function(arg0) {
            const ret = arg0.gpu;
            return ret;
        },
        __wbg_height_6664d43063375ca4: function(arg0) {
            const ret = arg0.height;
            return ret;
        },
        __wbg_height_ef5b5950872773b5: function(arg0) {
            const ret = arg0.height;
            return ret;
        },
        __wbg_info_22dcf1fd1b12bc7d: function(arg0) {
            const ret = arg0.info;
            return ret;
        },
        __wbg_info_5cfb3f6c22c53cf9: function(arg0, arg1, arg2, arg3) {
            console.info(arg0, arg1, arg2, arg3);
        },
        __wbg_instanceof_DedicatedWorkerGlobalScope_3eb76d36d8b1299e: function(arg0) {
            let result;
            try {
                result = arg0 instanceof DedicatedWorkerGlobalScope;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_GpuAdapter_fc7b89fc546de0bc: function(arg0) {
            let result;
            try {
                result = arg0 instanceof GPUAdapter;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_GpuCanvasContext_1a39fd0621603553: function(arg0) {
            let result;
            try {
                result = arg0 instanceof GPUCanvasContext;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_GpuDeviceLostInfo_c0ebce29b32e81e8: function(arg0) {
            let result;
            try {
                result = arg0 instanceof GPUDeviceLostInfo;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_HtmlCanvasElement_8325b7578cc1684c: function(arg0) {
            let result;
            try {
                result = arg0 instanceof HTMLCanvasElement;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_OffscreenCanvas_e659f51cf3c8ce03: function(arg0) {
            let result;
            try {
                result = arg0 instanceof OffscreenCanvas;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_Response_cb984bd66d7bd408: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Response;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_Window_e093be59ee9a8e14: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Window;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_WorkerGlobalScope_fe1d59aa8cd22e9a: function(arg0) {
            let result;
            try {
                result = arg0 instanceof WorkerGlobalScope;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_label_47480289cc2bce71: function(arg0, arg1) {
            const ret = arg1.label;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_length_4a591ecaa01354d9: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_length_7abca14930109c1c: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_limits_1c25cb4f379a4418: function(arg0) {
            const ret = arg0.limits;
            return ret;
        },
        __wbg_limits_50a8c5e629dbfe40: function(arg0) {
            const ret = arg0.limits;
            return ret;
        },
        __wbg_livekaleidoscopeengine_new: function(arg0) {
            const ret = LiveKaleidoscopeEngine.__wrap(arg0);
            return ret;
        },
        __wbg_log_cf2e968649f3384e: function(arg0) {
            console.log(arg0);
        },
        __wbg_log_d5e0f90a3ac097e3: function(arg0, arg1, arg2, arg3) {
            console.log(arg0, arg1, arg2, arg3);
        },
        __wbg_lost_7b1065bddc80e8ac: function(arg0) {
            const ret = arg0.lost;
            return ret;
        },
        __wbg_mapAsync_bb0029907dd91181: function(arg0, arg1, arg2, arg3) {
            const ret = arg0.mapAsync(arg1 >>> 0, arg2, arg3);
            return ret;
        },
        __wbg_maxBindGroups_14611ac9ed1c6b56: function(arg0) {
            const ret = arg0.maxBindGroups;
            return ret;
        },
        __wbg_maxBindingsPerBindGroup_dd3f66044d2a9bfb: function(arg0) {
            const ret = arg0.maxBindingsPerBindGroup;
            return ret;
        },
        __wbg_maxBufferSize_f7ce3e1856349d2f: function(arg0) {
            const ret = arg0.maxBufferSize;
            return ret;
        },
        __wbg_maxColorAttachmentBytesPerSample_55e64194645ea041: function(arg0) {
            const ret = arg0.maxColorAttachmentBytesPerSample;
            return ret;
        },
        __wbg_maxColorAttachments_fd9187f9f786da18: function(arg0) {
            const ret = arg0.maxColorAttachments;
            return ret;
        },
        __wbg_maxComputeInvocationsPerWorkgroup_9b3b1fc261129782: function(arg0) {
            const ret = arg0.maxComputeInvocationsPerWorkgroup;
            return ret;
        },
        __wbg_maxComputeWorkgroupSizeX_c55bbbcc02b75241: function(arg0) {
            const ret = arg0.maxComputeWorkgroupSizeX;
            return ret;
        },
        __wbg_maxComputeWorkgroupSizeY_96f40b1ec3102a3a: function(arg0) {
            const ret = arg0.maxComputeWorkgroupSizeY;
            return ret;
        },
        __wbg_maxComputeWorkgroupSizeZ_c2b1061d521561bb: function(arg0) {
            const ret = arg0.maxComputeWorkgroupSizeZ;
            return ret;
        },
        __wbg_maxComputeWorkgroupStorageSize_fac26e89d99e08f9: function(arg0) {
            const ret = arg0.maxComputeWorkgroupStorageSize;
            return ret;
        },
        __wbg_maxComputeWorkgroupsPerDimension_cd001f910e9b4d70: function(arg0) {
            const ret = arg0.maxComputeWorkgroupsPerDimension;
            return ret;
        },
        __wbg_maxDynamicStorageBuffersPerPipelineLayout_29399b82af020d86: function(arg0) {
            const ret = arg0.maxDynamicStorageBuffersPerPipelineLayout;
            return ret;
        },
        __wbg_maxDynamicUniformBuffersPerPipelineLayout_6d6cf80f3bd08e52: function(arg0) {
            const ret = arg0.maxDynamicUniformBuffersPerPipelineLayout;
            return ret;
        },
        __wbg_maxInterStageShaderVariables_8b000f47a166b1d5: function(arg0) {
            const ret = arg0.maxInterStageShaderVariables;
            return ret;
        },
        __wbg_maxSampledTexturesPerShaderStage_618a49f33217dde2: function(arg0) {
            const ret = arg0.maxSampledTexturesPerShaderStage;
            return ret;
        },
        __wbg_maxSamplersPerShaderStage_aa09fa0311712a1a: function(arg0) {
            const ret = arg0.maxSamplersPerShaderStage;
            return ret;
        },
        __wbg_maxStorageBufferBindingSize_0ec83ae10ad73180: function(arg0) {
            const ret = arg0.maxStorageBufferBindingSize;
            return ret;
        },
        __wbg_maxStorageBuffersPerShaderStage_0cca5b468fcf10b6: function(arg0) {
            const ret = arg0.maxStorageBuffersPerShaderStage;
            return ret;
        },
        __wbg_maxStorageTexturesPerShaderStage_9d6c35770f37866c: function(arg0) {
            const ret = arg0.maxStorageTexturesPerShaderStage;
            return ret;
        },
        __wbg_maxTextureArrayLayers_c2bf9c85285832d4: function(arg0) {
            const ret = arg0.maxTextureArrayLayers;
            return ret;
        },
        __wbg_maxTextureDimension1D_e09f86e22ea6bac9: function(arg0) {
            const ret = arg0.maxTextureDimension1D;
            return ret;
        },
        __wbg_maxTextureDimension2D_2631916ef9a3efa8: function(arg0) {
            const ret = arg0.maxTextureDimension2D;
            return ret;
        },
        __wbg_maxTextureDimension3D_06ee54121b37d431: function(arg0) {
            const ret = arg0.maxTextureDimension3D;
            return ret;
        },
        __wbg_maxUniformBufferBindingSize_af9e8a077907ed64: function(arg0) {
            const ret = arg0.maxUniformBufferBindingSize;
            return ret;
        },
        __wbg_maxUniformBuffersPerShaderStage_f871b70865df8c11: function(arg0) {
            const ret = arg0.maxUniformBuffersPerShaderStage;
            return ret;
        },
        __wbg_maxVertexAttributes_e72dabb2714f5cf5: function(arg0) {
            const ret = arg0.maxVertexAttributes;
            return ret;
        },
        __wbg_maxVertexBufferArrayStride_6a1cd814386082ce: function(arg0) {
            const ret = arg0.maxVertexBufferArrayStride;
            return ret;
        },
        __wbg_maxVertexBuffers_9c61c5fd286ebcc6: function(arg0) {
            const ret = arg0.maxVertexBuffers;
            return ret;
        },
        __wbg_message_09714b1dbee17e65: function(arg0, arg1) {
            const ret = arg1.message;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_minStorageBufferOffsetAlignment_e214f59628fb3558: function(arg0) {
            const ret = arg0.minStorageBufferOffsetAlignment;
            return ret;
        },
        __wbg_minUniformBufferOffsetAlignment_58b69e1c3924f6a4: function(arg0) {
            const ret = arg0.minUniformBufferOffsetAlignment;
            return ret;
        },
        __wbg_navigator_3833ecdbc19d2757: function(arg0) {
            const ret = arg0.navigator;
            return ret;
        },
        __wbg_navigator_391291470f58c650: function(arg0) {
            const ret = arg0.navigator;
            return ret;
        },
        __wbg_new_227d7c05414eb861: function() {
            const ret = new Error();
            return ret;
        },
        __wbg_new_578aeef4b6b94378: function(arg0) {
            const ret = new Uint8Array(arg0);
            return ret;
        },
        __wbg_new_ce1ab61c1c2b300d: function() {
            const ret = new Object();
            return ret;
        },
        __wbg_new_d90091b82fdf5b91: function() {
            const ret = new Array();
            return ret;
        },
        __wbg_new_typed_bf31d18f92484486: function(arg0, arg1) {
            try {
                var state0 = {a: arg0, b: arg1};
                var cb0 = (arg0, arg1) => {
                    const a = state0.a;
                    state0.a = 0;
                    try {
                        return wasm_bindgen_a8f69a54841d2f43___convert__closures_____invoke___js_sys_bdba67b44b1e3d03___Function_fn_wasm_bindgen_a8f69a54841d2f43___JsValue_____wasm_bindgen_a8f69a54841d2f43___sys__Undefined___js_sys_bdba67b44b1e3d03___Function_fn_wasm_bindgen_a8f69a54841d2f43___JsValue_____wasm_bindgen_a8f69a54841d2f43___sys__Undefined_______true_(a, state0.b, arg0, arg1);
                    } finally {
                        state0.a = a;
                    }
                };
                const ret = new Promise(cb0);
                return ret;
            } finally {
                state0.a = 0;
            }
        },
        __wbg_ok_fb13c30bc1893039: function(arg0) {
            const ret = arg0.ok;
            return ret;
        },
        __wbg_onSubmittedWorkDone_1460145eecea40ef: function(arg0) {
            const ret = arg0.onSubmittedWorkDone();
            return ret;
        },
        __wbg_prototypesetcall_3249fc62a0fafa30: function(arg0, arg1, arg2) {
            Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
        },
        __wbg_prototypesetcall_6239d0967941c8d9: function(arg0, arg1, arg2) {
            Float32Array.prototype.set.call(getArrayF32FromWasm0(arg0, arg1), arg2);
        },
        __wbg_push_a6822215aa43e71c: function(arg0, arg1) {
            const ret = arg0.push(arg1);
            return ret;
        },
        __wbg_querySelectorAll_4dcc230a2f8a2498: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.querySelectorAll(getStringFromWasm0(arg1, arg2));
            return ret;
        }, arguments); },
        __wbg_queueMicrotask_35c611f4a14830b2: function(arg0) {
            queueMicrotask(arg0);
        },
        __wbg_queueMicrotask_404ed0a58e0b63cc: function(arg0) {
            const ret = arg0.queueMicrotask;
            return ret;
        },
        __wbg_queue_65d985f3e6d786a6: function(arg0) {
            const ret = arg0.queue;
            return ret;
        },
        __wbg_reason_21c585c1cbc2cc8f: function(arg0) {
            const ret = arg0.reason;
            return (__wbindgen_enum_GpuDeviceLostReason.indexOf(ret) + 1 || 3) - 1;
        },
        __wbg_requestAdapter_9ff5c9d1ff271165: function(arg0, arg1) {
            const ret = arg0.requestAdapter(arg1);
            return ret;
        },
        __wbg_requestAnimationFrame_72bbc2f340fc7a29: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.requestAnimationFrame(arg1);
            return ret;
        }, arguments); },
        __wbg_requestAnimationFrame_9f66c039f113b4c6: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.requestAnimationFrame(arg1);
            return ret;
        }, arguments); },
        __wbg_requestDevice_c1c34f88a477e509: function(arg0, arg1) {
            const ret = arg0.requestDevice(arg1);
            return ret;
        },
        __wbg_resolve_25a7e548d5881dca: function(arg0) {
            const ret = Promise.resolve(arg0);
            return ret;
        },
        __wbg_setBindGroup_4ba56e1e0d26f244: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            arg0.setBindGroup(arg1 >>> 0, arg2, getArrayU32FromWasm0(arg3, arg4), arg5, arg6 >>> 0);
        }, arguments); },
        __wbg_setBindGroup_6124849cc8547086: function(arg0, arg1, arg2) {
            arg0.setBindGroup(arg1 >>> 0, arg2);
        },
        __wbg_setBindGroup_79afcff8b9db8be3: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            arg0.setBindGroup(arg1 >>> 0, arg2, getArrayU32FromWasm0(arg3, arg4), arg5, arg6 >>> 0);
        }, arguments); },
        __wbg_setBindGroup_84eb639ac393a9f4: function(arg0, arg1, arg2) {
            arg0.setBindGroup(arg1 >>> 0, arg2);
        },
        __wbg_setPipeline_95c76ab8da697fcf: function(arg0, arg1) {
            arg0.setPipeline(arg1);
        },
        __wbg_setPipeline_bab24dbce96903b9: function(arg0, arg1) {
            arg0.setPipeline(arg1);
        },
        __wbg_set_6e30c9374c26414c: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = Reflect.set(arg0, arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_set_a_5f6e488475272136: function(arg0, arg1) {
            arg0.a = arg1;
        },
        __wbg_set_access_091f317905cd76a5: function(arg0, arg1) {
            arg0.access = __wbindgen_enum_GpuStorageTextureAccess[arg1];
        },
        __wbg_set_address_mode_u_a37cf1035585c638: function(arg0, arg1) {
            arg0.addressModeU = __wbindgen_enum_GpuAddressMode[arg1];
        },
        __wbg_set_address_mode_v_8ac049e029caef76: function(arg0, arg1) {
            arg0.addressModeV = __wbindgen_enum_GpuAddressMode[arg1];
        },
        __wbg_set_address_mode_w_eb9260ee11729e92: function(arg0, arg1) {
            arg0.addressModeW = __wbindgen_enum_GpuAddressMode[arg1];
        },
        __wbg_set_alpha_aa2e606e9e647b21: function(arg0, arg1) {
            arg0.alpha = arg1;
        },
        __wbg_set_alpha_mode_92402195b3ae1ee7: function(arg0, arg1) {
            arg0.alphaMode = __wbindgen_enum_GpuCanvasAlphaMode[arg1];
        },
        __wbg_set_alpha_to_coverage_enabled_b4ce9c3f7f8b7ad7: function(arg0, arg1) {
            arg0.alphaToCoverageEnabled = arg1 !== 0;
        },
        __wbg_set_array_layer_count_daec613068108a9d: function(arg0, arg1) {
            arg0.arrayLayerCount = arg1 >>> 0;
        },
        __wbg_set_array_stride_c2c009eabc18b5f6: function(arg0, arg1) {
            arg0.arrayStride = arg1;
        },
        __wbg_set_aspect_77332ac136ee94eb: function(arg0, arg1) {
            arg0.aspect = __wbindgen_enum_GpuTextureAspect[arg1];
        },
        __wbg_set_aspect_a823a14d00d42d37: function(arg0, arg1) {
            arg0.aspect = __wbindgen_enum_GpuTextureAspect[arg1];
        },
        __wbg_set_attributes_05f9117fd32ca606: function(arg0, arg1) {
            arg0.attributes = arg1;
        },
        __wbg_set_b_688365d692bba214: function(arg0, arg1) {
            arg0.b = arg1;
        },
        __wbg_set_base_array_layer_cc6c68d233489c4b: function(arg0, arg1) {
            arg0.baseArrayLayer = arg1 >>> 0;
        },
        __wbg_set_base_mip_level_e07a3efe9006d5ea: function(arg0, arg1) {
            arg0.baseMipLevel = arg1 >>> 0;
        },
        __wbg_set_beginning_of_pass_write_index_27be5b0b35ec3de0: function(arg0, arg1) {
            arg0.beginningOfPassWriteIndex = arg1 >>> 0;
        },
        __wbg_set_beginning_of_pass_write_index_c12e7856ee670800: function(arg0, arg1) {
            arg0.beginningOfPassWriteIndex = arg1 >>> 0;
        },
        __wbg_set_bind_group_layouts_5325d038771af328: function(arg0, arg1) {
            arg0.bindGroupLayouts = arg1;
        },
        __wbg_set_binding_b6b0fe5c281b8c69: function(arg0, arg1) {
            arg0.binding = arg1 >>> 0;
        },
        __wbg_set_binding_f3c188a8cd21455b: function(arg0, arg1) {
            arg0.binding = arg1 >>> 0;
        },
        __wbg_set_blend_8d6e9c08b5702a09: function(arg0, arg1) {
            arg0.blend = arg1;
        },
        __wbg_set_buffer_55f096330c8912b4: function(arg0, arg1) {
            arg0.buffer = arg1;
        },
        __wbg_set_buffer_e89095a9f0cafad3: function(arg0, arg1) {
            arg0.buffer = arg1;
        },
        __wbg_set_buffers_85a7238f4ef28ab4: function(arg0, arg1) {
            arg0.buffers = arg1;
        },
        __wbg_set_bytes_per_row_91681ca78d744888: function(arg0, arg1) {
            arg0.bytesPerRow = arg1 >>> 0;
        },
        __wbg_set_clear_value_642701f928a5ccb3: function(arg0, arg1) {
            arg0.clearValue = arg1;
        },
        __wbg_set_code_56e2d45ec1ff6c2d: function(arg0, arg1, arg2) {
            arg0.code = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_color_attachments_abe67f6631926e28: function(arg0, arg1) {
            arg0.colorAttachments = arg1;
        },
        __wbg_set_color_bc393d7efc3c8594: function(arg0, arg1) {
            arg0.color = arg1;
        },
        __wbg_set_compare_1509dc1a5420943f: function(arg0, arg1) {
            arg0.compare = __wbindgen_enum_GpuCompareFunction[arg1];
        },
        __wbg_set_compare_42211fbf15e3b850: function(arg0, arg1) {
            arg0.compare = __wbindgen_enum_GpuCompareFunction[arg1];
        },
        __wbg_set_compute_5a859e405c9eb6c6: function(arg0, arg1) {
            arg0.compute = arg1;
        },
        __wbg_set_count_26a934d1cd07d080: function(arg0, arg1) {
            arg0.count = arg1 >>> 0;
        },
        __wbg_set_cull_mode_9d466c1ab414cac8: function(arg0, arg1) {
            arg0.cullMode = __wbindgen_enum_GpuCullMode[arg1];
        },
        __wbg_set_depth_bias_428c9340b0fd937b: function(arg0, arg1) {
            arg0.depthBias = arg1;
        },
        __wbg_set_depth_bias_clamp_f009599ca67fa30c: function(arg0, arg1) {
            arg0.depthBiasClamp = arg1;
        },
        __wbg_set_depth_bias_slope_scale_7125880b4cb7a951: function(arg0, arg1) {
            arg0.depthBiasSlopeScale = arg1;
        },
        __wbg_set_depth_clear_value_442bf492734f63b6: function(arg0, arg1) {
            arg0.depthClearValue = arg1;
        },
        __wbg_set_depth_compare_30e9ea552da12fe2: function(arg0, arg1) {
            arg0.depthCompare = __wbindgen_enum_GpuCompareFunction[arg1];
        },
        __wbg_set_depth_fail_op_5e42dc3e4c382951: function(arg0, arg1) {
            arg0.depthFailOp = __wbindgen_enum_GpuStencilOperation[arg1];
        },
        __wbg_set_depth_load_op_34d430b74bb36d91: function(arg0, arg1) {
            arg0.depthLoadOp = __wbindgen_enum_GpuLoadOp[arg1];
        },
        __wbg_set_depth_or_array_layers_4bbbeadacb393f02: function(arg0, arg1) {
            arg0.depthOrArrayLayers = arg1 >>> 0;
        },
        __wbg_set_depth_read_only_138a11b10c731094: function(arg0, arg1) {
            arg0.depthReadOnly = arg1 !== 0;
        },
        __wbg_set_depth_stencil_1bd50dbc450c8650: function(arg0, arg1) {
            arg0.depthStencil = arg1;
        },
        __wbg_set_depth_stencil_attachment_1ee0d93bc3273369: function(arg0, arg1) {
            arg0.depthStencilAttachment = arg1;
        },
        __wbg_set_depth_store_op_0ea0a215313dbda7: function(arg0, arg1) {
            arg0.depthStoreOp = __wbindgen_enum_GpuStoreOp[arg1];
        },
        __wbg_set_depth_write_enabled_64c2e7f6fa4b6b7b: function(arg0, arg1) {
            arg0.depthWriteEnabled = arg1 !== 0;
        },
        __wbg_set_device_0d774b66e7288f72: function(arg0, arg1) {
            arg0.device = arg1;
        },
        __wbg_set_dimension_174ad7e2fb67fb4e: function(arg0, arg1) {
            arg0.dimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
        },
        __wbg_set_dimension_36e13ccecae5af4b: function(arg0, arg1) {
            arg0.dimension = __wbindgen_enum_GpuTextureDimension[arg1];
        },
        __wbg_set_dst_factor_1ed75271a89a711e: function(arg0, arg1) {
            arg0.dstFactor = __wbindgen_enum_GpuBlendFactor[arg1];
        },
        __wbg_set_end_of_pass_write_index_e8f52fc08bc0603e: function(arg0, arg1) {
            arg0.endOfPassWriteIndex = arg1 >>> 0;
        },
        __wbg_set_end_of_pass_write_index_f4ab90c5743df805: function(arg0, arg1) {
            arg0.endOfPassWriteIndex = arg1 >>> 0;
        },
        __wbg_set_entries_3017e6132f938c6e: function(arg0, arg1) {
            arg0.entries = arg1;
        },
        __wbg_set_entries_fc76ca4d7da6a709: function(arg0, arg1) {
            arg0.entries = arg1;
        },
        __wbg_set_entry_point_4443daff87d82ef1: function(arg0, arg1, arg2) {
            arg0.entryPoint = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_entry_point_6fec5723cc790927: function(arg0, arg1, arg2) {
            arg0.entryPoint = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_entry_point_8db3b6d103e3b865: function(arg0, arg1, arg2) {
            arg0.entryPoint = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_external_texture_825fe2bc7a0c0603: function(arg0, arg1) {
            arg0.externalTexture = arg1;
        },
        __wbg_set_fail_op_77ab26c98f847b65: function(arg0, arg1) {
            arg0.failOp = __wbindgen_enum_GpuStencilOperation[arg1];
        },
        __wbg_set_format_1786adb7bc74c7c9: function(arg0, arg1) {
            arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
        },
        __wbg_set_format_6606f5c1fba6f459: function(arg0, arg1) {
            arg0.format = __wbindgen_enum_GpuVertexFormat[arg1];
        },
        __wbg_set_format_90860b0321868db4: function(arg0, arg1) {
            arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
        },
        __wbg_set_format_abf7a1bc5425c56a: function(arg0, arg1) {
            arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
        },
        __wbg_set_format_d347899cd860709c: function(arg0, arg1) {
            arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
        },
        __wbg_set_format_e9d4b1475bb3bd3b: function(arg0, arg1) {
            arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
        },
        __wbg_set_format_f9341112e43ea182: function(arg0, arg1) {
            arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
        },
        __wbg_set_fragment_1a595620425637e1: function(arg0, arg1) {
            arg0.fragment = arg1;
        },
        __wbg_set_front_face_50cdf4eb61504a46: function(arg0, arg1) {
            arg0.frontFace = __wbindgen_enum_GpuFrontFace[arg1];
        },
        __wbg_set_g_d4d1d77cf8fdd362: function(arg0, arg1) {
            arg0.g = arg1;
        },
        __wbg_set_has_dynamic_offset_7d30014fdbfe90c5: function(arg0, arg1) {
            arg0.hasDynamicOffset = arg1 !== 0;
        },
        __wbg_set_height_0739170de8653cc4: function(arg0, arg1) {
            arg0.height = arg1 >>> 0;
        },
        __wbg_set_height_c661af0c0b5376f9: function(arg0, arg1) {
            arg0.height = arg1 >>> 0;
        },
        __wbg_set_height_e8b5483b8c117d5e: function(arg0, arg1) {
            arg0.height = arg1 >>> 0;
        },
        __wbg_set_label_03d2396d4655a3e1: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_0c1bd0e976cf0a9a: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_1175a3329a06e52b: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_2d2227f4d5991e50: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_2f592bd1be3db6b3: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_4a1dd4244f80abc9: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_8b0da33fd11b2572: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_8fd860a36d2c7b74: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_bae57fb9f24fde5c: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_be45aed56e4b9fee: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_c47c451211e2f6d2: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_cd567b7b35838e4c: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_d1c24b5a7a3ac31d: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_dcd98efbb9370da8: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_f92ae11c77d74198: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_layout_19e558a0fa724e95: function(arg0, arg1) {
            arg0.layout = arg1;
        },
        __wbg_set_layout_7c5ba5bdcde8a0f0: function(arg0, arg1) {
            arg0.layout = arg1;
        },
        __wbg_set_layout_eeef59714f5bf48b: function(arg0, arg1) {
            arg0.layout = arg1;
        },
        __wbg_set_load_op_56844f51434037bf: function(arg0, arg1) {
            arg0.loadOp = __wbindgen_enum_GpuLoadOp[arg1];
        },
        __wbg_set_lod_max_clamp_3f157633f32c9f94: function(arg0, arg1) {
            arg0.lodMaxClamp = arg1;
        },
        __wbg_set_lod_min_clamp_7e246c739fb1a854: function(arg0, arg1) {
            arg0.lodMinClamp = arg1;
        },
        __wbg_set_mag_filter_69d846b974d4bcc0: function(arg0, arg1) {
            arg0.magFilter = __wbindgen_enum_GpuFilterMode[arg1];
        },
        __wbg_set_mapped_at_creation_48de4735fab51e78: function(arg0, arg1) {
            arg0.mappedAtCreation = arg1 !== 0;
        },
        __wbg_set_mask_0c49a66362fc0079: function(arg0, arg1) {
            arg0.mask = arg1 >>> 0;
        },
        __wbg_set_max_anisotropy_3ef0d5bca2336cc7: function(arg0, arg1) {
            arg0.maxAnisotropy = arg1;
        },
        __wbg_set_min_binding_size_689661b9ed25e083: function(arg0, arg1) {
            arg0.minBindingSize = arg1;
        },
        __wbg_set_min_filter_fbf2d8d9f503dcd7: function(arg0, arg1) {
            arg0.minFilter = __wbindgen_enum_GpuFilterMode[arg1];
        },
        __wbg_set_mip_level_246db61be15bdd69: function(arg0, arg1) {
            arg0.mipLevel = arg1 >>> 0;
        },
        __wbg_set_mip_level_count_72f8bc1f80f7539b: function(arg0, arg1) {
            arg0.mipLevelCount = arg1 >>> 0;
        },
        __wbg_set_mip_level_count_b19a0d9192e62d5d: function(arg0, arg1) {
            arg0.mipLevelCount = arg1 >>> 0;
        },
        __wbg_set_mipmap_filter_17fd50a3898fd5ff: function(arg0, arg1) {
            arg0.mipmapFilter = __wbindgen_enum_GpuMipmapFilterMode[arg1];
        },
        __wbg_set_module_08ad08e736d8edbf: function(arg0, arg1) {
            arg0.module = arg1;
        },
        __wbg_set_module_14e471fdd94c582d: function(arg0, arg1) {
            arg0.module = arg1;
        },
        __wbg_set_module_9b938909233aed50: function(arg0, arg1) {
            arg0.module = arg1;
        },
        __wbg_set_multisample_85f073947b782d07: function(arg0, arg1) {
            arg0.multisample = arg1;
        },
        __wbg_set_multisampled_40505c1381e1c32c: function(arg0, arg1) {
            arg0.multisampled = arg1 !== 0;
        },
        __wbg_set_offset_73156b0e0b41d79a: function(arg0, arg1) {
            arg0.offset = arg1;
        },
        __wbg_set_offset_8d9d9afffa18b591: function(arg0, arg1) {
            arg0.offset = arg1;
        },
        __wbg_set_offset_a097a8050a3a9a33: function(arg0, arg1) {
            arg0.offset = arg1;
        },
        __wbg_set_operation_b5862f5a1a143b30: function(arg0, arg1) {
            arg0.operation = __wbindgen_enum_GpuBlendOperation[arg1];
        },
        __wbg_set_origin_9b3b0fbe0a5dc469: function(arg0, arg1) {
            arg0.origin = arg1;
        },
        __wbg_set_pass_op_e9470d1262fb8a8b: function(arg0, arg1) {
            arg0.passOp = __wbindgen_enum_GpuStencilOperation[arg1];
        },
        __wbg_set_power_preference_c0d3fa7ce46b1a2e: function(arg0, arg1) {
            arg0.powerPreference = __wbindgen_enum_GpuPowerPreference[arg1];
        },
        __wbg_set_primitive_369241acd17871f1: function(arg0, arg1) {
            arg0.primitive = arg1;
        },
        __wbg_set_query_set_18679a8580267d5a: function(arg0, arg1) {
            arg0.querySet = arg1;
        },
        __wbg_set_query_set_f1314b06c84c4b00: function(arg0, arg1) {
            arg0.querySet = arg1;
        },
        __wbg_set_r_527e5a41c4b1a846: function(arg0, arg1) {
            arg0.r = arg1;
        },
        __wbg_set_required_features_54918de8185c5fab: function(arg0, arg1) {
            arg0.requiredFeatures = arg1;
        },
        __wbg_set_required_limits_3b031f66f838f4e3: function(arg0, arg1) {
            arg0.requiredLimits = arg1;
        },
        __wbg_set_resolve_target_fe76b3f99cf72078: function(arg0, arg1) {
            arg0.resolveTarget = arg1;
        },
        __wbg_set_resource_fe385d2e3dadaf63: function(arg0, arg1) {
            arg0.resource = arg1;
        },
        __wbg_set_rows_per_image_d198b7e73a38978b: function(arg0, arg1) {
            arg0.rowsPerImage = arg1 >>> 0;
        },
        __wbg_set_sample_count_865e1d19b84e27e6: function(arg0, arg1) {
            arg0.sampleCount = arg1 >>> 0;
        },
        __wbg_set_sample_type_7088b1efddce6a69: function(arg0, arg1) {
            arg0.sampleType = __wbindgen_enum_GpuTextureSampleType[arg1];
        },
        __wbg_set_sampler_8c5d7fb1b02058c6: function(arg0, arg1) {
            arg0.sampler = arg1;
        },
        __wbg_set_shader_location_0ff30a733291a396: function(arg0, arg1) {
            arg0.shaderLocation = arg1 >>> 0;
        },
        __wbg_set_size_1e6281b07cd39177: function(arg0, arg1) {
            arg0.size = arg1;
        },
        __wbg_set_size_41cd9255ca1e4242: function(arg0, arg1) {
            arg0.size = arg1;
        },
        __wbg_set_size_a61ff22205255d61: function(arg0, arg1) {
            arg0.size = arg1;
        },
        __wbg_set_src_factor_1c4f755f8676df1b: function(arg0, arg1) {
            arg0.srcFactor = __wbindgen_enum_GpuBlendFactor[arg1];
        },
        __wbg_set_stencil_back_6ef4683123b19b25: function(arg0, arg1) {
            arg0.stencilBack = arg1;
        },
        __wbg_set_stencil_clear_value_10b58f674d0177c2: function(arg0, arg1) {
            arg0.stencilClearValue = arg1 >>> 0;
        },
        __wbg_set_stencil_front_aeb8580a97e5424b: function(arg0, arg1) {
            arg0.stencilFront = arg1;
        },
        __wbg_set_stencil_load_op_f20a90a66acd3d8c: function(arg0, arg1) {
            arg0.stencilLoadOp = __wbindgen_enum_GpuLoadOp[arg1];
        },
        __wbg_set_stencil_read_mask_2954f260d47349ea: function(arg0, arg1) {
            arg0.stencilReadMask = arg1 >>> 0;
        },
        __wbg_set_stencil_read_only_fb489d191b6d969b: function(arg0, arg1) {
            arg0.stencilReadOnly = arg1 !== 0;
        },
        __wbg_set_stencil_store_op_477c4cf6422dfa3f: function(arg0, arg1) {
            arg0.stencilStoreOp = __wbindgen_enum_GpuStoreOp[arg1];
        },
        __wbg_set_stencil_write_mask_3f8e9b3781814a95: function(arg0, arg1) {
            arg0.stencilWriteMask = arg1 >>> 0;
        },
        __wbg_set_step_mode_a35aef328761c452: function(arg0, arg1) {
            arg0.stepMode = __wbindgen_enum_GpuVertexStepMode[arg1];
        },
        __wbg_set_storage_texture_ab9eed9786337ef0: function(arg0, arg1) {
            arg0.storageTexture = arg1;
        },
        __wbg_set_store_op_caeede4654b3d847: function(arg0, arg1) {
            arg0.storeOp = __wbindgen_enum_GpuStoreOp[arg1];
        },
        __wbg_set_strip_index_format_0cd0510e166c4ec4: function(arg0, arg1) {
            arg0.stripIndexFormat = __wbindgen_enum_GpuIndexFormat[arg1];
        },
        __wbg_set_targets_6b0b3bdd87f35668: function(arg0, arg1) {
            arg0.targets = arg1;
        },
        __wbg_set_texture_16d2be474ce6ad0c: function(arg0, arg1) {
            arg0.texture = arg1;
        },
        __wbg_set_texture_e25a73da75cf5808: function(arg0, arg1) {
            arg0.texture = arg1;
        },
        __wbg_set_timestamp_writes_26336a2ad72cdcaf: function(arg0, arg1) {
            arg0.timestampWrites = arg1;
        },
        __wbg_set_timestamp_writes_c552d52fbb417005: function(arg0, arg1) {
            arg0.timestampWrites = arg1;
        },
        __wbg_set_topology_beefb3aca0612b00: function(arg0, arg1) {
            arg0.topology = __wbindgen_enum_GpuPrimitiveTopology[arg1];
        },
        __wbg_set_type_38961e08504ca674: function(arg0, arg1) {
            arg0.type = __wbindgen_enum_GpuBufferBindingType[arg1];
        },
        __wbg_set_type_c1eebc19f8a6aeb9: function(arg0, arg1) {
            arg0.type = __wbindgen_enum_GpuSamplerBindingType[arg1];
        },
        __wbg_set_unclipped_depth_5a4f7eb57fe006b2: function(arg0, arg1) {
            arg0.unclippedDepth = arg1 !== 0;
        },
        __wbg_set_usage_7f0dda8309469b1c: function(arg0, arg1) {
            arg0.usage = arg1 >>> 0;
        },
        __wbg_set_usage_7fa9cd18d1104aca: function(arg0, arg1) {
            arg0.usage = arg1 >>> 0;
        },
        __wbg_set_usage_908213a4d4bb8bde: function(arg0, arg1) {
            arg0.usage = arg1 >>> 0;
        },
        __wbg_set_usage_ae014e77ff77ce06: function(arg0, arg1) {
            arg0.usage = arg1 >>> 0;
        },
        __wbg_set_vertex_a4951dd9a7a4ed54: function(arg0, arg1) {
            arg0.vertex = arg1;
        },
        __wbg_set_view_bdeab150b5f0768c: function(arg0, arg1) {
            arg0.view = arg1;
        },
        __wbg_set_view_dbd0294573f64d05: function(arg0, arg1) {
            arg0.view = arg1;
        },
        __wbg_set_view_dimension_263387976511ebc9: function(arg0, arg1) {
            arg0.viewDimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
        },
        __wbg_set_view_dimension_3ed01b237e85826f: function(arg0, arg1) {
            arg0.viewDimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
        },
        __wbg_set_view_formats_bab284fc81b40e70: function(arg0, arg1) {
            arg0.viewFormats = arg1;
        },
        __wbg_set_view_formats_fe531a043efb71fa: function(arg0, arg1) {
            arg0.viewFormats = arg1;
        },
        __wbg_set_visibility_1bca121a89accba5: function(arg0, arg1) {
            arg0.visibility = arg1 >>> 0;
        },
        __wbg_set_width_1a5e2e86fa5bdcd8: function(arg0, arg1) {
            arg0.width = arg1 >>> 0;
        },
        __wbg_set_width_7ca43f32db1cfe8e: function(arg0, arg1) {
            arg0.width = arg1 >>> 0;
        },
        __wbg_set_width_87301412247f3343: function(arg0, arg1) {
            arg0.width = arg1 >>> 0;
        },
        __wbg_set_write_mask_144b25e2bd909124: function(arg0, arg1) {
            arg0.writeMask = arg1 >>> 0;
        },
        __wbg_set_x_56f0c2c08a62725c: function(arg0, arg1) {
            arg0.x = arg1 >>> 0;
        },
        __wbg_set_y_04fb8ce84735b4e1: function(arg0, arg1) {
            arg0.y = arg1 >>> 0;
        },
        __wbg_set_z_a51316db27a4941e: function(arg0, arg1) {
            arg0.z = arg1 >>> 0;
        },
        __wbg_stack_3b0d974bbf31e44f: function(arg0, arg1) {
            const ret = arg1.stack;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_static_accessor_GLOBAL_9d53f2689e622ca1: function() {
            const ret = typeof global === 'undefined' ? null : global;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_GLOBAL_THIS_a1a35cec07001a8a: function() {
            const ret = typeof globalThis === 'undefined' ? null : globalThis;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_SELF_4c59f6c7ea29a144: function() {
            const ret = typeof self === 'undefined' ? null : self;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_WINDOW_e70ae9f2eb052253: function() {
            const ret = typeof window === 'undefined' ? null : window;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_status_00549d55b78d949e: function(arg0) {
            const ret = arg0.status;
            return ret;
        },
        __wbg_submit_1290d44bb76ecef4: function(arg0, arg1) {
            arg0.submit(arg1);
        },
        __wbg_then_18f476d590e58992: function(arg0, arg1, arg2) {
            const ret = arg0.then(arg1, arg2);
            return ret;
        },
        __wbg_then_47213a40b6aeb86c: function(arg0, arg1) {
            const ret = arg0.then(arg1);
            return ret;
        },
        __wbg_then_529ea37d9bdbf95d: function(arg0, arg1, arg2) {
            const ret = arg0.then(arg1, arg2);
            return ret;
        },
        __wbg_then_ac7b025999b52837: function(arg0, arg1) {
            const ret = arg0.then(arg1);
            return ret;
        },
        __wbg_warn_c49a7a9581bf8bea: function(arg0, arg1, arg2, arg3) {
            console.warn(arg0, arg1, arg2, arg3);
        },
        __wbg_width_440db126d7331632: function(arg0) {
            const ret = arg0.width;
            return ret;
        },
        __wbg_width_796e38875beab5e6: function(arg0) {
            const ret = arg0.width;
            return ret;
        },
        __wbg_writeBuffer_b4bdd36178348ca5: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            arg0.writeBuffer(arg1, arg2, getArrayU8FromWasm0(arg3, arg4), arg5, arg6);
        }, arguments); },
        __wbg_writeTexture_b45b69132e46a227: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
            arg0.writeTexture(arg1, getArrayU8FromWasm0(arg2, arg3), arg4, arg5);
        }, arguments); },
        __wbindgen_cast_0000000000000001: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [Externref], shim_idx: 113, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_a8f69a54841d2f43___convert__closures_____invoke___wasm_bindgen_a8f69a54841d2f43___JsValue______true_);
            return ret;
        },
        __wbindgen_cast_0000000000000002: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [Externref], shim_idx: 157, ret: Result(Unit), inner_ret: Some(Result(Unit)) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_a8f69a54841d2f43___convert__closures_____invoke___wasm_bindgen_a8f69a54841d2f43___JsValue__core_9e4b53dd61fe0b34___result__Result_____wasm_bindgen_a8f69a54841d2f43___JsError___true_);
            return ret;
        },
        __wbindgen_cast_0000000000000003: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [F64], shim_idx: 2, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_a8f69a54841d2f43___convert__closures_____invoke___f64______true_);
            return ret;
        },
        __wbindgen_cast_0000000000000004: function(arg0) {
            // Cast intrinsic for `F64 -> Externref`.
            const ret = arg0;
            return ret;
        },
        __wbindgen_cast_0000000000000005: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./kaleidomo_core_bg.js": import0,
    };
}

function wasm_bindgen_a8f69a54841d2f43___convert__closures_____invoke___wasm_bindgen_a8f69a54841d2f43___JsValue______true_(arg0, arg1, arg2) {
    wasm.wasm_bindgen_a8f69a54841d2f43___convert__closures_____invoke___wasm_bindgen_a8f69a54841d2f43___JsValue______true_(arg0, arg1, arg2);
}

function wasm_bindgen_a8f69a54841d2f43___convert__closures_____invoke___wasm_bindgen_a8f69a54841d2f43___JsValue__core_9e4b53dd61fe0b34___result__Result_____wasm_bindgen_a8f69a54841d2f43___JsError___true_(arg0, arg1, arg2) {
    const ret = wasm.wasm_bindgen_a8f69a54841d2f43___convert__closures_____invoke___wasm_bindgen_a8f69a54841d2f43___JsValue__core_9e4b53dd61fe0b34___result__Result_____wasm_bindgen_a8f69a54841d2f43___JsError___true_(arg0, arg1, arg2);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

function wasm_bindgen_a8f69a54841d2f43___convert__closures_____invoke___js_sys_bdba67b44b1e3d03___Function_fn_wasm_bindgen_a8f69a54841d2f43___JsValue_____wasm_bindgen_a8f69a54841d2f43___sys__Undefined___js_sys_bdba67b44b1e3d03___Function_fn_wasm_bindgen_a8f69a54841d2f43___JsValue_____wasm_bindgen_a8f69a54841d2f43___sys__Undefined_______true_(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen_a8f69a54841d2f43___convert__closures_____invoke___js_sys_bdba67b44b1e3d03___Function_fn_wasm_bindgen_a8f69a54841d2f43___JsValue_____wasm_bindgen_a8f69a54841d2f43___sys__Undefined___js_sys_bdba67b44b1e3d03___Function_fn_wasm_bindgen_a8f69a54841d2f43___JsValue_____wasm_bindgen_a8f69a54841d2f43___sys__Undefined_______true_(arg0, arg1, arg2, arg3);
}

function wasm_bindgen_a8f69a54841d2f43___convert__closures_____invoke___f64______true_(arg0, arg1, arg2) {
    wasm.wasm_bindgen_a8f69a54841d2f43___convert__closures_____invoke___f64______true_(arg0, arg1, arg2);
}


const __wbindgen_enum_GpuAddressMode = ["clamp-to-edge", "repeat", "mirror-repeat"];


const __wbindgen_enum_GpuBlendFactor = ["zero", "one", "src", "one-minus-src", "src-alpha", "one-minus-src-alpha", "dst", "one-minus-dst", "dst-alpha", "one-minus-dst-alpha", "src-alpha-saturated", "constant", "one-minus-constant", "src1", "one-minus-src1", "src1-alpha", "one-minus-src1-alpha"];


const __wbindgen_enum_GpuBlendOperation = ["add", "subtract", "reverse-subtract", "min", "max"];


const __wbindgen_enum_GpuBufferBindingType = ["uniform", "storage", "read-only-storage"];


const __wbindgen_enum_GpuCanvasAlphaMode = ["opaque", "premultiplied"];


const __wbindgen_enum_GpuCompareFunction = ["never", "less", "equal", "less-equal", "greater", "not-equal", "greater-equal", "always"];


const __wbindgen_enum_GpuCullMode = ["none", "front", "back"];


const __wbindgen_enum_GpuDeviceLostReason = ["unknown", "destroyed"];


const __wbindgen_enum_GpuFilterMode = ["nearest", "linear"];


const __wbindgen_enum_GpuFrontFace = ["ccw", "cw"];


const __wbindgen_enum_GpuIndexFormat = ["uint16", "uint32"];


const __wbindgen_enum_GpuLoadOp = ["load", "clear"];


const __wbindgen_enum_GpuMipmapFilterMode = ["nearest", "linear"];


const __wbindgen_enum_GpuPowerPreference = ["low-power", "high-performance"];


const __wbindgen_enum_GpuPrimitiveTopology = ["point-list", "line-list", "line-strip", "triangle-list", "triangle-strip"];


const __wbindgen_enum_GpuSamplerBindingType = ["filtering", "non-filtering", "comparison"];


const __wbindgen_enum_GpuStencilOperation = ["keep", "zero", "replace", "invert", "increment-clamp", "decrement-clamp", "increment-wrap", "decrement-wrap"];


const __wbindgen_enum_GpuStorageTextureAccess = ["write-only", "read-only", "read-write"];


const __wbindgen_enum_GpuStoreOp = ["store", "discard"];


const __wbindgen_enum_GpuTextureAspect = ["all", "stencil-only", "depth-only"];


const __wbindgen_enum_GpuTextureDimension = ["1d", "2d", "3d"];


const __wbindgen_enum_GpuTextureFormat = ["r8unorm", "r8snorm", "r8uint", "r8sint", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32uint", "r32sint", "r32float", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb9e5ufloat", "rgb10a2uint", "rgb10a2unorm", "rg11b10ufloat", "rg32uint", "rg32sint", "rg32float", "rgba16uint", "rgba16sint", "rgba16float", "rgba32uint", "rgba32sint", "rgba32float", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8", "bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb", "etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm", "astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"];


const __wbindgen_enum_GpuTextureSampleType = ["float", "unfilterable-float", "depth", "sint", "uint"];


const __wbindgen_enum_GpuTextureViewDimension = ["1d", "2d", "2d-array", "cube", "cube-array", "3d"];


const __wbindgen_enum_GpuVertexFormat = ["uint8", "uint8x2", "uint8x4", "sint8", "sint8x2", "sint8x4", "unorm8", "unorm8x2", "unorm8x4", "snorm8", "snorm8x2", "snorm8x4", "uint16", "uint16x2", "uint16x4", "sint16", "sint16x2", "sint16x4", "unorm16", "unorm16x2", "unorm16x4", "snorm16", "snorm16x2", "snorm16x4", "float16", "float16x2", "float16x4", "float32", "float32x2", "float32x3", "float32x4", "uint32", "uint32x2", "uint32x3", "uint32x4", "sint32", "sint32x2", "sint32x3", "sint32x4", "unorm10-10-10-2", "unorm8x4-bgra"];


const __wbindgen_enum_GpuVertexStepMode = ["vertex", "instance"];
const LiveKaleidoscopeEngineFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_livekaleidoscopeengine_free(ptr, 1));
const WasmVideoSettingsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmvideosettings_free(ptr, 1));

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => wasm.__wbindgen_destroy_closure(state.a, state.b));

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedFloat32ArrayMemory0 = null;
function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
        cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint32ArrayMemory0 = null;
function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function makeMutClosure(arg0, arg1, f) {
    const state = { a: arg0, b: arg1, cnt: 1 };
    const real = (...args) => {

        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            state.a = a;
            real._wbg_cb_unref();
        }
    };
    real._wbg_cb_unref = () => {
        if (--state.cnt === 0) {
            wasm.__wbindgen_destroy_closure(state.a, state.b);
            state.a = 0;
            CLOSURE_DTORS.unregister(state);
        }
    };
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedFloat32ArrayMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('kaleidomo_core_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
