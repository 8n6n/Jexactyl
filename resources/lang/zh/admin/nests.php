<?php

return [
    'notices' => [
        'created' => '新的预设组 :name 已成功创建。',
        'deleted' => '已成功从面板删除请求的预设组。',
        'updated' => '预设组配置选项已成功更新。',
    ],
    'eggs' => [
        'notices' => [
            'imported' => '已成功导入此预设及其关联变量。',
            'updated_via_import' => '此预设已使用提供的文件进行更新。',
            'deleted' => '已成功从面板删除请求的预设。',
            'updated' => '预设配置已成功更新。',
            'script_updated' => '预设安装脚本已更新，将在服务器安装时运行。',
            'egg_created' => '新预设已成功创建。您需要重启任何正在运行的守护进程以应用此新预设。',
        ],
    ],
    'variables' => [
        'notices' => [
            'variable_deleted' => '变量 ":variable" 已被删除，重建后将不再对服务器可用。',
            'variable_updated' => '变量 ":variable" 已更新。您需要重建使用此变量的任何服务器以应用更改。',
            'variable_created' => '新变量已成功创建并分配给此预设。',
        ],
    ],
];
