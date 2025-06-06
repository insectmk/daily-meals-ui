import { requestClient } from '#/api/request';

export namespace InfraRedisApi {
  /** Redis 信息 */
  export interface RedisInfo {
    io_threaded_reads_processed: string;
    tracking_clients: string;
    uptime_in_seconds: string;
    cluster_connections: string;
    current_cow_size: string;
    maxmemory_human: string;
    aof_last_cow_size: string;
    master_replid2: string;
    mem_replication_backlog: string;
    aof_rewrite_scheduled: string;
    total_net_input_bytes: string;
    rss_overhead_ratio: string;
    hz: string;
    current_cow_size_age: string;
    redis_build_id: string;
    errorstat_BUSYGROUP: string;
    aof_last_bgrewrite_status: string;
    multiplexing_api: string;
    client_recent_max_output_buffer: string;
    allocator_resident: string;
    mem_fragmentation_bytes: string;
    aof_current_size: string;
    repl_backlog_first_byte_offset: string;
    tracking_total_prefixes: string;
    redis_mode: string;
    redis_git_dirty: string;
    aof_delayed_fsync: string;
    allocator_rss_bytes: string;
    repl_backlog_histlen: string;
    io_threads_active: string;
    rss_overhead_bytes: string;
    total_system_memory: string;
    loading: string;
    evicted_keys: string;
    maxclients: string;
    cluster_enabled: string;
    redis_version: string;
    repl_backlog_active: string;
    mem_aof_buffer: string;
    allocator_frag_bytes: string;
    io_threaded_writes_processed: string;
    instantaneous_ops_per_sec: string;
    used_memory_human: string;
    total_error_replies: string;
    role: string;
    maxmemory: string;
    used_memory_lua: string;
    rdb_current_bgsave_time_sec: string;
    used_memory_startup: string;
    used_cpu_sys_main_thread: string;
    lazyfree_pending_objects: string;
    aof_pending_bio_fsync: string;
    used_memory_dataset_perc: string;
    allocator_frag_ratio: string;
    arch_bits: string;
    used_cpu_user_main_thread: string;
    mem_clients_normal: string;
    expired_time_cap_reached_count: string;
    unexpected_error_replies: string;
    mem_fragmentation_ratio: string;
    aof_last_rewrite_time_sec: string;
    master_replid: string;
    aof_rewrite_in_progress: string;
    lru_clock: string;
    maxmemory_policy: string;
    run_id: string;
    latest_fork_usec: string;
    tracking_total_items: string;
    total_commands_processed: string;
    expired_keys: string;
    errorstat_ERR: string;
    used_memory: string;
    module_fork_in_progress: string;
    errorstat_WRONGPASS: string;
    aof_buffer_length: string;
    dump_payload_sanitizations: string;
    mem_clients_slaves: string;
    keyspace_misses: string;
    server_time_usec: string;
    executable: string;
    lazyfreed_objects: string;
    db0: string;
    used_memory_peak_human: string;
    keyspace_hits: string;
    rdb_last_cow_size: string;
    aof_pending_rewrite: string;
    used_memory_overhead: string;
    active_defrag_hits: string;
    tcp_port: string;
    uptime_in_days: string;
    used_memory_peak_perc: string;
    current_save_keys_processed: string;
    blocked_clients: string;
    total_reads_processed: string;
    expire_cycle_cpu_milliseconds: string;
    sync_partial_err: string;
    used_memory_scripts_human: string;
    aof_current_rewrite_time_sec: string;
    aof_enabled: string;
    process_supervised: string;
    master_repl_offset: string;
    used_memory_dataset: string;
    used_cpu_user: string;
    rdb_last_bgsave_status: string;
    tracking_total_keys: string;
    atomicvar_api: string;
    allocator_rss_ratio: string;
    client_recent_max_input_buffer: string;
    clients_in_timeout_table: string;
    aof_last_write_status: string;
    mem_allocator: string;
    used_memory_scripts: string;
    used_memory_peak: string;
    process_id: string;
    master_failover_state: string;
    errorstat_NOAUTH: string;
    used_cpu_sys: string;
    repl_backlog_size: string;
    connected_slaves: string;
    current_save_keys_total: string;
    gcc_version: string;
    total_system_memory_human: string;
    sync_full: string;
    connected_clients: string;
    module_fork_last_cow_size: string;
    total_writes_processed: string;
    allocator_active: string;
    total_net_output_bytes: string;
    pubsub_channels: string;
    current_fork_perc: string;
    active_defrag_key_hits: string;
    rdb_changes_since_last_save: string;
    instantaneous_input_kbps: string;
    used_memory_rss_human: string;
    configured_hz: string;
    expired_stale_perc: string;
    active_defrag_misses: string;
    used_cpu_sys_children: string;
    number_of_cached_scripts: string;
    sync_partial_ok: string;
    used_memory_lua_human: string;
    rdb_last_save_time: string;
    pubsub_patterns: string;
    slave_expires_tracked_keys: string;
    redis_git_sha1: string;
    used_memory_rss: string;
    rdb_last_bgsave_time_sec: string;
    os: string;
    mem_not_counted_for_evict: string;
    active_defrag_running: string;
    rejected_connections: string;
    aof_rewrite_buffer_length: string;
    total_forks: string;
    active_defrag_key_misses: string;
    allocator_allocated: string;
    aof_base_size: string;
    instantaneous_output_kbps: string;
    second_repl_offset: string;
    rdb_bgsave_in_progress: string;
    used_cpu_user_children: string;
    total_connections_received: string;
    migrate_cached_sockets: string;
  }

  /** Redis 命令统计 */
  export interface RedisCommandStats {
    command: string;
    calls: number;
    usec: number;
  }

  /** Redis 监控信息 */
  export interface RedisMonitorInfo {
    info: RedisInfo;
    dbSize: number;
    commandStats: RedisCommandStats[];
  }
}

/** 获取 Redis 监控信息 */
export function getRedisMonitorInfo() {
  return requestClient.get<InfraRedisApi.RedisMonitorInfo>(
    '/infra/redis/get-monitor-info',
  );
}
