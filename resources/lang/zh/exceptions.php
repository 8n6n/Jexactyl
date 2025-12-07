<?php

return [
    'daemon_connection_failed' => '尝试与守护进程通信时发生异常，返回 HTTP/:code 响应代码。此异常已被记录。',
    'node' => [
        'servers_attached' => '节点必须没有关联的服务器才能被删除。',
        'daemon_off_config_updated' => '守护进程配置<strong>已更新</strong>，但在尝试自动更新守护进程上的配置文件时遇到错误。您需要手动更新守护进程的配置文件（config.yml）以应用这些更改。',
    ],
    'allocations' => [
        'server_using' => '当前有服务器正在使用此端口分配。只有当没有服务器使用时才能删除端口分配。',
        'too_many_ports' => '不支持一次性添加超过 1000 个端口。',
        'invalid_mapping' => '为 :port 提供的映射无效，无法处理。',
        'cidr_out_of_range' => 'CIDR 表示法只允许 /25 到 /32 之间的掩码。',
        'port_out_of_range' => '端口分配中的端口必须大于 1024 且小于或等于 65535。',
    ],
    'nest' => [
        'delete_has_servers' => '无法从面板删除附有活动服务器的预设组。',
        'egg' => [
            'delete_has_servers' => '无法从面板删除附有活动服务器的预设。',
            'invalid_copy_id' => '选择用于复制脚本的预设不存在，或者它本身正在复制脚本。',
            'must_be_child' => '此预设的"复制设置来源"指令必须是所选预设组的子选项。',
            'has_children' => '此预设是一个或多个其他预设的父级。请先删除这些预设，然后再删除此预设。',
        ],
        'variables' => [
            'env_not_unique' => '环境变量 :name 必须对此预设唯一。',
            'reserved_name' => '环境变量 :name 是受保护的，不能分配给变量。',
            'bad_validation_rule' => '验证规则 ":rule" 不是此应用程序的有效规则。',
        ],
        'importer' => [
            'json_error' => '尝试解析 JSON 文件时发生错误：:error。',
            'file_error' => '提供的 JSON 文件无效。',
            'invalid_json_provided' => '提供的 JSON 文件格式无法识别。',
        ],
    ],
    'subusers' => [
        'editing_self' => '不允许编辑您自己的子用户账户。',
        'user_is_owner' => '您不能将服务器所有者添加为此服务器的子用户。',
        'subuser_exists' => '该邮箱地址的用户已被指定为此服务器的子用户。',
    ],
    'databases' => [
        'delete_has_databases' => '无法删除有活动数据库关联的数据库主机服务器。',
    ],
    'tasks' => [
        'chain_interval_too_long' => '链式任务的最大间隔时间为 15 分钟。',
    ],
    'users' => [
        'node_revocation_failed' => '在 <a href=":link">节点 #:node</a> 上撤销密钥失败。:error',
    ],
    'deployment' => [
        'no_viable_nodes' => '找不到满足自动部署所需要求的节点。',
        'no_viable_allocations' => '找不到满足自动部署要求的端口分配。',
    ],
    'api' => [
        'resource_not_found' => '请求的资源在此服务器上不存在。',
    ],
];
