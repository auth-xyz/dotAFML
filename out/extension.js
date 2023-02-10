const vscode = require('vscode');
const fs = require('fs');

function activate(context) {
    let disposable = vscode.languages.registerDocumentSymbolProvider('afml', {
        provideDocumentSymbols: (document, token) => {
            let sections = [];
            let sectionLines = [];
            let inSection = false;

            for (let i = 0; i < document.lineCount; i++) {
                let line = document.lineAt(i);
                let lineText = line.text.trim();
                if (lineText.startsWith('[') && lineText.endsWith(']')) {
                    if (inSection) {
                        sections.push({
                            name: sectionLines[0],
                            type: 'section',
                            range: new vscode.Range(sectionLines[0].start, sectionLines[sectionLines.length - 1].end),
                            selectionRange: new vscode.Range(sectionLines[0].start, sectionLines[0].end)
                        });
                    }
                    inSection = true;
                    sectionLines = [line];
                } else {
                    if (inSection) {
                        sectionLines.push(line);
                    }
                }
            }

            if (inSection) {
                sections.push({
                    name: sectionLines[0],
                    type: 'section',
                    range: new vscode.Range(sectionLines[0].start, sectionLines[sectionLines.length - 1].end),
                    selectionRange: new vscode.Range(sectionLines[0].start, sectionLines[0].end)
                });
            }

            return sections;
        }
    });

    context.subscriptions.push(disposable);
}

exports.activate = activate;
