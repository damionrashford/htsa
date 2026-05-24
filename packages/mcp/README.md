# @htsa/mcp

MCP server for the [HTSA](../../FRAMEWORK.md) investigation algorithm. Gives any MCP-compatible client (Claude Desktop, Continue, Cursor, etc.) a full root cause analysis capability.

## Run via npx

```sh
HTSA_API_KEY=sk-... npx @htsa/mcp
```

## Claude Desktop config

```json
{
  "mcpServers": {
    "htsa": {
      "command": "npx",
      "args": ["@htsa/mcp"]
    }
  }
}
```

## Tools

| Tool | What it does |
|---|---|
| `create_investigation` | Start a new investigation session |
| `update_situation` | Fill in the 5 Ws (Layer 1) |
| `start_causal_chain` | Create the origin node (Layer 2) |
| `add_hypothesis` | Add a Why answer as a child node |
| `add_evidence` | Attach evidence — triggers Bayesian update |
| `mark_root_cause` | Confirm a root cause once all 4 depth criteria pass |
| `add_resolution` | Assign fix / mitigate / accept (Layer 3) |
| `get_report` | Export the investigation as Markdown or JSON |
| `check_bias` | Scan for cognitive bias patterns |

## Example session

```
User: investigate why the checkout service is returning 500s

Claude: [create_investigation] title="Checkout 500s since 02:47 UTC"
        [update_situation] whoAffected="EU customers", what="500 on /checkout"
        [start_causal_chain] surfaceWhy="Payment service timing out"
        [add_hypothesis] "DB connection pool exhausted"
        [add_hypothesis] "Downstream payment gateway down"
        [add_evidence] source="logs", tier=1, direction="supports", description="Pool at 100%"
        [mark_root_cause] all depth criteria pass
        [add_resolution] type="fix", change="Pool size 20→100 + circuit breaker"
        [get_report] format="markdown"
```

## License

MIT
