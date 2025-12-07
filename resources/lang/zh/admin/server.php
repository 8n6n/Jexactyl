<?php

return [
    'exceptions' => [
        'no_new_default_allocation' => '您正在尝试删除此服务器的默认端口分配，但没有备用端口分配可用。',
        'marked_as_failed' => '此服务器在之前的安装中被标记为失败。在此状态下无法切换当前状态。',
        'bad_variable' => '变量 :name 存在验证错误。',
        'daemon_exception' => '尝试与守护进程通信时发生异常，返回 HTTP/:code 响应代码。此异常已被记录。（请求 ID：:request_id）',
        'default_allocation_not_found' => '在此服务器的端口分配中未找到请求的默认端口分配。',
    ],
    'alerts' => [
        'startup_changed' => '此服务器的启动配置已更新。如果此服务器的预设组或预设已更改，将立即进行重新安装。',
        'server_deleted' => '服务器已成功从系统删除。',
        'server_created' => '服务器已在面板上成功创建。请等待守护进程几分钟以完成此服务器的安装。',
        'build_updated' => '此服务器的构建详情已更新。某些更改可能需要重启才能生效。',
        'suspension_toggled' => '服务器暂停状态已更改为 :status。',
        'rebuild_on_boot' => '此服务器已被标记为需要重建 Docker 容器。这将在下次启动服务器时进行。',
        'install_toggled' => '此服务器的安装状态已切换。',
        'server_reinstalled' => '此服务器已排队等待重新安装，即将开始。',
        'details_updated' => '服务器详情已成功更新。',
        'docker_image_updated' => '已成功更改此服务器使用的默认 Docker 镜像。需要重启以应用此更改。',
        'node_required' => '在向此面板添加服务器之前，您必须至少配置一个节点。',
        'transfer_nodes_required' => '在转移服务器之前，您必须至少配置两个节点。',
        'transfer_started' => '服务器转移已开始。',
        'transfer_not_viable' => '您选择的节点没有足够的磁盘空间或内存来容纳此服务器。',
    ],
];
