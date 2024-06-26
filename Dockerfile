FROM bun:1 as builder
WORKDIR /app
COPY package.json bun.lockdb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM allypost/cdn:latest
COPY --from=builder /app/dist /app
CMD ["--serve-directory", "/app"]