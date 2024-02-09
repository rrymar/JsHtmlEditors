/*jshint esversion: 6 */
/**
 * Rich Text Editor overview sample
 */
ej.base.registerLicense('Ngo9BigBOggjHTQxAR8/V1NAaF1cWWhKYVppR2Nbe05xdV9DY1ZSRmYuP1ZhSXxXdkdjUX5fdXdQQ2ZaVEY=');

var defaultRTE;
var divPreview;
var hostUrl = 'https://ej2-aspcore-service.azurewebsites.net/';

var defaultRTE = new ej.richtexteditor.RichTextEditor({
    toolbarSettings: {
        items: ['Bold', 'Italic', 'Underline', 'StrikeThrough', 'SuperScript', 'SubScript', '|',
            'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
            'LowerCase', 'UpperCase', '|',
            'Formats', 'Alignments', '|', 'NumberFormatList', 'BulletFormatList', '|',
            'Outdent', 'Indent', '|', 'CreateLink', 'Image', 'FileManager', 'Video', 'Audio', 'CreateTable', '|', 'FormatPainter', 'ClearFormat',
            '|', 'EmojiPicker', 'Print', '|',
            'SourceCode', 'FullScreen', '|', 'Undo', 'Redo']
    },
    fileManagerSettings: {
        enable: true,
        path: '/Pictures/Food',
        ajaxSettings: {
            url: hostUrl + 'api/FileManager/FileOperations',
            getImageUrl: hostUrl + 'api/FileManager/GetImage',
            uploadUrl: hostUrl + 'api/FileManager/Upload',
            downloadUrl: hostUrl + 'api/FileManager/Download'
        }
    },
    quickToolbarSettings: {
        table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-', 'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles']
    },
    showCharCount: true,
    actionBegin: handleFullScreen,
    actionComplete: actionCompleteHandler
});
defaultRTE.appendTo("#defaultRTE");
divPreview = document.getElementById('DIV_Preview');
var textArea = defaultRTE.contentModule.getEditPanel();
var myCodeMirror;

function mirrorConversion(e) {
    var id = defaultRTE.getID() + 'mirror-view';
    var mirrorView = defaultRTE.element.querySelector('#' + id);
    var charCount = defaultRTE.element.querySelector('.e-rte-character-count');
    if (e.targetItem === 'Preview') {
        textArea.style.display = 'block';
        mirrorView.style.display = 'none';
        textArea.innerHTML = myCodeMirror.getValue();
        charCount.style.display = 'block';
    } else {
        if (!mirrorView) {
            mirrorView = ej.base.createElement('div', {className: 'e-content'});
            mirrorView.id = id;
            textArea.parentNode.appendChild(mirrorView);
        } else {
            mirrorView.innerHTML = '';
        }
        textArea.style.display = 'none';
        mirrorView.style.display = 'block';
        renderCodeMirror(mirrorView, defaultRTE.value);
        charCount.style.display = 'none';
    }
}

function renderCodeMirror(mirrorView, content) {
    myCodeMirror = CodeMirror(mirrorView, {
        value: content,
        lineNumbers: true,
        mode: 'text/html',
        lineWrapping: true,
    });
}

function handleFullScreen(e) {
    var sbCntEle = document.querySelector('.sb-content.e-view');
    var sbHdrEle = document.querySelector('.sb-header.e-view');
    var leftBar;
    var transformElement;
    if (ej.base.Browser.isDevice) {
        leftBar = document.querySelector('#right-sidebar');
        transformElement = document.querySelector('.sample-browser.e-view.e-content-animation');
    } else {
        leftBar = document.querySelector('#left-sidebar');
        transformElement = document.querySelector('#right-pane');
    }
    if (e.targetItem === 'Maximize') {
        if (ej.base.Browser.isDevice && ej.base.Browser.isIos) {
            ej.base.addClass([sbCntEle, sbHdrEle], ['hide-header']);
        }
        ej.base.addClass([leftBar], ['e-close']);
        ej.base.removeClass([leftBar], ['e-open']);
        if (!ej.base.Browser.isDevice) {
            transformElement.style.marginLeft = '0px';
        }
        transformElement.style.transform = 'inherit';
    } else if (e.targetItem === 'Minimize') {
        if (ej.base.Browser.isDevice && ej.base.Browser.isIos) {
            ej.base.removeClass([sbCntEle, sbHdrEle], ['hide-header']);
        }
        ej.base.removeClass([leftBar], ['e-close']);
        if (!ej.base.Browser.isDevice) {
            ej.base.addClass([leftBar], ['e-open']);
            transformElement.style.marginLeft = leftBar.offsetWidth + 'px';
        }
        transformElement.style.transform = 'translateX(0px)';
    }
}

function actionCompleteHandler(e) {
    if (e.targetItem && (e.targetItem === 'SourceCode' || e.targetItem === 'Preview')) {
        this.sourceCodeModule.getPanel().style.display = 'none';
        mirrorConversion(e);
    } else {
        setTimeout(function () {
            defaultRTE.toolbarModule.refreshToolbarOverflow();
        }, 1000);
    }
}