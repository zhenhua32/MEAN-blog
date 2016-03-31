'use strict';

var markValue = angular.module('markValue', []);

markValue.value('defaultTinymceOptions', {
    selector: 'textarea',
    height: 400,
    width: '95%',
    /* contextmenu */
    plugins: 'code link textcolor colorpicker table paste',
    toolbar: 'undo redo | styleselect | bold italic | forecolor backcolor link',
    language: 'zh_CN',
    /* link */
    default_link_target: '_blank',
    link_assume_external_targets: true,
    /* contextmenu */
    contextmenu: '',
});

markValue.value('readOnlyTinymceOptions', {
    selector: 'textarea',
    height: 400,
    width: '95%',
    toolbar: false,
    menubar: false,
    statusbar: false
});