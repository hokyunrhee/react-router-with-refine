FROM public.ecr.aws/docker/library/node:20-bookworm-slim as builder
WORKDIR "/var/task"
COPY . .
RUN npm install && npm run build && npm prune --omit=dev

FROM public.ecr.aws/docker/library/node:20-bookworm-slim
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter
WORKDIR "/var/task"
COPY --from=builder /var/task/build ./build
COPY --from=builder /var/task/node_modules ./node_modules
COPY --from=builder /var/task/package.json ./package.json

ENV PORT=8080
ENV NODE_ENV=production

CMD ["npm", "run", "start"]
