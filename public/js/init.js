// 未使用, 只是个模版
tinymce.init({
    selector: 'textarea',
    //skin: 'light',
    height: 400,
    width: '95%',
    plugins: 'code link textcolor colorpicker fullpage',
    toolbar: 'undo redo | styleselect | bold italic | forecolor backcolor link fullpage',
    language: 'zh_CN',
    /* link */
    default_link_target: '_blank',
    link_assume_external_targets: true,
    /* fullpage */
    fullpage_default_encoding: 'UTF-8',
    fullpage_default_fontsize: '16px'
});