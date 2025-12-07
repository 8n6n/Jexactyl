<?php

return [
    'user' => [
        'search_users' => '输入用户名、用户 ID 或电子邮件地址',
        'select_search_user' => '要删除的用户 ID（输入 \'0\' 重新搜索）',
        'deleted' => '用户已成功从面板删除。',
        'confirm_delete' => '您确定要从面板删除此用户吗？',
        'no_users_found' => '未找到与提供的搜索词匹配的用户。',
        'multiple_found' => '为提供的用户找到多个账户，由于 --no-interaction 标志，无法删除用户。',
        'ask_admin' => '此用户是管理员吗？',
        'ask_email' => '电子邮件地址',
        'ask_username' => '用户名',
        'ask_name_first' => '名字',
        'ask_name_last' => '姓氏',
        'ask_password' => '密码',
        'ask_password_tip' => '如果您想创建一个随机密码并通过电子邮件发送给用户的账户，请重新运行此命令（CTRL+C）并传递 `--no-password` 标志。',
        'ask_password_help' => '密码长度必须至少为 8 个字符，并包含至少一个大写字母和数字。',
        '2fa_help_text' => [
            '如果启用了双因素认证，此命令将为用户账户禁用它。这应该仅在用户被锁定在其账户外时作为账户恢复命令使用。',
            '如果这不是您想要做的，请按 CTRL+C 退出此过程。',
        ],
        '2fa_disabled' => ':email 的双因素认证已禁用。',
    ],
    'schedule' => [
        'output_line' => '正在调度 `:schedule`（:hash）中第一个任务的作业。',
    ],
    'maintenance' => [
        'deleting_service_backup' => '正在删除服务备份文件 :file。',
    ],
    'server' => [
        'rebuild_failed' => '节点 ":node" 上的 ":name"（#:id）重建请求失败，错误：:message',
        'reinstall' => [
            'failed' => '节点 ":node" 上的 ":name"（#:id）重新安装请求失败，错误：:message',
            'confirm' => '您即将对一组服务器执行重新安装。是否继续？',
        ],
        'power' => [
            'confirm' => '您即将对 :count 台服务器执行 :action 操作。是否继续？',
            'action_failed' => '节点 ":node" 上的 ":name"（#:id）电源操作请求失败，错误：:message',
        ],
    ],
];
